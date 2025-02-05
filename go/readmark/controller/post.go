package controller

import (
	"github.com/gofiber/fiber/v3"
	. "readmark/db"
)

func handlePostMark(c fiber.Ctx) *Post {
	req := ParseJson(c, &Post{})
	return req
}
