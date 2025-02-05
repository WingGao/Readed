package controller

import (
	"github.com/gofiber/fiber/v3"
	"readmark/model"
)

func Init(app *fiber.App) {
	api := app.Group("/api")
	// post
	api.Post("/post/mark", wrapResponse(handlePostMark))
}

func wrapResponse[T any](h func(ctx fiber.Ctx) T) fiber.Handler {
	return func(ctx fiber.Ctx) error {
		resp := model.BaseResp{Code: 0}
		defer func() {
			if r := recover(); r != nil {
				resp.Code = 400
				resp.Msg = "Internal Server Error"
				ctx.Status(400)
			}
			ctx.JSON(resp)
		}()
		resp.Data = h(ctx)
		return nil
	}
}
