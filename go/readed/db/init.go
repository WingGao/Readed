package db

import (
	"fmt"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"readed/config"
)

var (
	client *mongo.Client
)

func Init() {
	client, _ := mongo.Connect(options.Client().ApplyURI(config.GlobalConfig.Mongo.Uri))
	fmt.Println("Connected to MongoDB!", client.NumberSessionsInProgress())
}
