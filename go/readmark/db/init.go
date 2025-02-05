package db

import (
	"fmt"
	"github.com/WingGao/webutils/werror"
	"github.com/bsm/redislock"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"readmark/config"
	"runtime"
)

var (
	client      *mongo.Client
	MainDB      *mongo.Database
	Redis       redis.UniversalClient
	RedisLocker *redislock.Client
)

func InitDB() {
	// https://www.mongodb.com/zh-cn/docs/drivers/go/current/usage-examples/
	client, _ = mongo.Connect(options.Client().ApplyURI(config.GlobalConfig.Mongo.Uri))
	MainDB = client.Database(config.GlobalConfig.Mongo.DB)
	fmt.Println("Connected to MongoDB!", client.NumberSessionsInProgress(), MainDB.Name())
	werror.PanicError(buildUserIndex(), buildPostIndex())

	Redis = redis.NewUniversalClient(&redis.UniversalOptions{
		Addrs:    []string{fmt.Sprintf("%s:%d", config.GlobalConfig.Redis.Host, config.GlobalConfig.Redis.Port)},
		DB:       config.GlobalConfig.Redis.DB,
		Password: config.GlobalConfig.Redis.Password,
		PoolSize: 10 * runtime.GOMAXPROCS(0),
	})
	RedisLocker = redislock.New(Redis)
}
