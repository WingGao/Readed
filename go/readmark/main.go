package main

import (
	"flag"
	"github.com/gofiber/fiber/v3"
	"readmark/config"
	"readmark/db"
)

var (
	configPath string
)

func main() {
	flag.StringVar(&configPath, "config", "", "config file path")
	flag.Parse()

	config.Init(configPath)
	db.Init()
	app := fiber.New()

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Listen(":29000")
}
