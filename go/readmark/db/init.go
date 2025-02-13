package db

import (
	"context"
	"entgo.io/ent/dialect"
	"entgo.io/ent/dialect/sql"
	"fmt"
	"github.com/WingGao/webutils/fiber3/flogger"
	"readmark/config"
	"readmark/ent"
	"runtime"

	"github.com/WingGao/webutils/werror"
	"github.com/bsm/redislock"
	_ "github.com/go-sql-driver/mysql"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var (
	client      *mongo.Client
	MainMg      *mongo.Database
	Redis       redis.UniversalClient
	RedisLocker *redislock.Client
)

func InitDB() {
	// https://www.mongodb.com/zh-cn/docs/drivers/go/current/usage-examples/
	client, _ = mongo.Connect(options.Client().ApplyURI(config.GlobalConfig.Mongo.Uri))
	MainMg = client.Database(config.GlobalConfig.Mongo.DB)
	fmt.Println("Connected to MongoDB!", client.NumberSessionsInProgress(), MainMg.Name())
	werror.PanicError(buildUserIndex(), buildPostIndex())
	drv, oerr := sql.Open("mysql", config.GlobalConfig.Mysql.Uri)
	werror.PanicError(oerr)
	ent.EntClient = ent.NewClient(ent.Driver(dialect.DebugWithContext(drv, func(ctx context.Context, a ...any) {
		flogger.My.Info(fmt.Sprint(a...))
	})))
	fmt.Println("Connected to MySQL!")
	werror.PanicError(ent.EntClient.Schema.Create(context.TODO()))
	// redis
	Redis = redis.NewUniversalClient(&redis.UniversalOptions{
		Addrs:    []string{fmt.Sprintf("%s:%d", config.GlobalConfig.Redis.Host, config.GlobalConfig.Redis.Port)},
		DB:       config.GlobalConfig.Redis.DB,
		Password: config.GlobalConfig.Redis.Password,
		PoolSize: 10 * runtime.GOMAXPROCS(0),
	})
	RedisLocker = redislock.New(Redis)
}
