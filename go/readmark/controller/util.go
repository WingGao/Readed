package controller

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gookit/goutil/errorx"
)

func ParseJson[T any](c fiber.Ctx, outPtr T) T {
	err := c.Bind().JSON(outPtr)
	if err != nil {
		panic(errorx.WithPrev(err, "参数错误"))
	}
	return outPtr
}

func ParseForm[T any](c fiber.Ctx, outPtr T) T {
	err := c.Bind().Form(outPtr)
	if err != nil {
		panic(errorx.WithPrev(err, "参数错误"))
	}
	return outPtr
}
