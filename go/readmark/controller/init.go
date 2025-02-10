package controller

import (
	"readmark/model"

	"github.com/WingGao/webutils/fiber3/flogger"
	"github.com/WingGao/webutils/werror"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/session"
)

var (
	validate *validator.Validate = validator.New()
)

const (
	SessionUserIdKey = "user_id"
)

func Init(app *fiber.App) {
	api := app.Group("/api")
	//TODO 拦截请求
	// post
	api.Post("/post/mark", wrapResponse(handlePostMark))
	api.Post("/post/search", wrapResponse(handlePostSearch))
	//user
	api.Post("/open/user/login", wrapResponse(handleUserLogin))
	api.Get("/user/check", wrapResponse(handleUserInfo))
}

func wrapResponse[T any](h func(ctx *FiberCtxExt) T) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		resp := model.BaseResp{Code: 0}
		defer func() {
			if r := recover(); r != nil {
				//if ex, ok := r.(errorx.ErrorX); ok {
				//	//errorx.WithOptions(ex.Cause().Error(),errorx.SkipDepth(1))
				//	flogger.WithFiberError(ctx, ex)
				//}
				err := r.(error)
				//if _, ok1 := r.(*errorx.ErrorX); ok1 {
				//
				//}
				resp.Code = 400
				ctx.Status(400)
				if be, ok := err.(*werror.BizError); ok { // 业务错误忽略
					resp.Code = be.Code
					switch be.Code {
					case werror.ERROR_CODE_NOT_LOGIN:
						ctx.Status(fiber.StatusUnauthorized)
					}
				} else {
					flogger.WithFiberError(ctx, err)
				}
				resp.Msg = err.Error()
			}
			ctx.JSON(resp)
		}()
		resp.Data = h(NewFiberCtxExt(ctx))
		return nil
	}
}

func formatValidationError(err error) {

}

func assertSession(c fiber.Ctx) (*session.Middleware, uint) {
	sess := session.FromContext(c)
	uid := sess.Get(SessionUserIdKey)
	if uid == nil {
		panic(werror.NewBizError("未登录", werror.ERROR_CODE_NOT_LOGIN))
	}
	return sess, uid.(uint)
}

type FiberCtxExt struct {
	fiber.Ctx
	uid uint
}

func (c *FiberCtxExt) Uid() uint {
	if c.uid > 0 {
		_, c.uid = assertSession(c)
	}
	return c.uid
}

func NewFiberCtxExt(c fiber.Ctx) *FiberCtxExt {
	return &FiberCtxExt{Ctx: c}
}
