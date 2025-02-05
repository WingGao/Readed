package controller

import (
	"github.com/WingGao/webutils/werror"
	"github.com/gofiber/fiber/v3"
	. "readmark/db"
)

func handlePostMark(c fiber.Ctx) *Post {
	req := ParseJson(c, &Post{})
	werror.PanicError(
		validate.Var(req.Site, "required"),
		validate.Var(req.Pid, "required"),
	)

	return req
}
