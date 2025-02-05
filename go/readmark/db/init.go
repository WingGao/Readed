package db

import (
	"fmt"
	"github.com/WingGao/webutils/werror"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"readmark/config"
)

var (
	client *mongo.Client
	MainDB *mongo.Database
)

func InitDB() {
	client, _ = mongo.Connect(options.Client().ApplyURI(config.GlobalConfig.Mongo.Uri))
	MainDB = client.Database(config.GlobalConfig.Mongo.DB)
	fmt.Println("Connected to MongoDB!", client.NumberSessionsInProgress(), MainDB.Name())
	werror.PanicError(buildPostIndex())
}
