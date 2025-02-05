package controller

import (
	"github.com/WingGao/webutils/fiber3/flogger"
	"github.com/gofiber/fiber/v3"
	"github.com/gookit/goutil/errorx"
)

func ParseJson[T any](c fiber.Ctx, outPtr T) T {
	err := c.Bind().JSON(outPtr)
	if err != nil {
		flogger.WithFiberError(c, err)
		panic(errorx.E("参数错误"))
	}
	return outPtr
}
