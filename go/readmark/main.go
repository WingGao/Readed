package main

import (
	"flag"
	"github.com/WingGao/webutils/fiber3/flogger"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/requestid"
	"readmark/config"
	"readmark/controller"
	"readmark/db"
)

var (
	configPath string
)

func main() {
	flag.StringVar(&configPath, "config", "", "config file path")
	flag.Parse()
	flogger.InitLogger()
	config.Init(configPath)
	db.InitDB()
	app := fiber.New()
	app.Use(requestid.New())
	//TODO 更好的log
	app.Use(logger.New(logger.Config{
		Format:     "[${time}][${respHeader:X-Request-ID}] ${status} - ${method} ${path}\n",
		TimeFormat: "2006-01-02 15:04:05",
	}))
	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	controller.Init(app)
	app.Listen(":29000")
}
