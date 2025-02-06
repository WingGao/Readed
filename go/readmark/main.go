package main

import (
	"flag"
	"github.com/WingGao/webutils/fiber3/flogger"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/logger"
	"github.com/gofiber/fiber/v3/middleware/requestid"
	"github.com/gofiber/fiber/v3/middleware/session"
	"github.com/gofiber/storage/redis/v3"
	"github.com/gofiber/utils/v2"
	"readmark/config"
	"readmark/controller"
	"readmark/db"
	"runtime"
	"time"
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
	// session
	store := redis.New(redis.Config{
		Host:     config.GlobalConfig.Redis.Host,
		Port:     config.GlobalConfig.Redis.Port,
		Password: config.GlobalConfig.Redis.Password,
		Database: config.GlobalConfig.Redis.DB,
		PoolSize: 10 * runtime.GOMAXPROCS(0),
	})

	sessionMiddleware, _ := session.NewWithStore(session.Config{
		Storage:         store,
		IdleTimeout:     10 * 24 * time.Duration(time.Hour),
		AbsoluteTimeout: 10 * 24 * time.Duration(time.Hour),
		//TODO 优化session
		KeyGenerator: func() string {
			return "readmark:session:" + utils.UUIDv4()
		},
	})
	app.Use(sessionMiddleware)

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	controller.Init(app)
	app.Listen(config.GlobalConfig.Addr)
}
