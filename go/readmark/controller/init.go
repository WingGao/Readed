package controller

import (
	"github.com/WingGao/webutils/fiber3/flogger"
	"github.com/WingGao/webutils/werror"
	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/session"
	"readmark/model"
)

var (
	validate *validator.Validate = validator.New()
)

const (
	SessionUserIdKey = "user_id"
)

func Init(app *fiber.App) {
	api := app.Group("/api")
	// post
	api.Post("/post/mark", wrapResponse(handlePostMark))
	//user
	api.Post("/open/user/login", wrapResponse(handleUserLogin))
	api.Get("/user/check", wrapResponse(handleUserInfo))
}

func wrapResponse[T any](h func(ctx fiber.Ctx) T) fiber.Handler {
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
				if _, ok := err.(*werror.BizError); ok { // 业务错误忽略

				} else {
					flogger.WithFiberError(ctx, err)
				}
				resp.Code = 400
				resp.Msg = err.Error()
				ctx.Status(400)
			}
			ctx.JSON(resp)
		}()
		resp.Data = h(ctx)
		return nil
	}
}

func formatValidationError(err error) {

}

func assertSession(c fiber.Ctx) (*session.Middleware, string) {
	sess := session.FromContext(c)
	uid := sess.Get(SessionUserIdKey)
	if uid == nil {
		panic(werror.NewBizError("未登录"))
	}
	return sess, uid.(string)
}
