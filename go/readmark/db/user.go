package db

import (
	"context"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type User struct {
	ID       bson.ObjectID `bson:"_id" json:",omitempty"`
	Username string        `bson:"Username" json:",omitempty"`
	Password string        `bson:"Password" json:",omitempty"`
}

func (p *User) C() *mongo.Collection {
	return MainDB.Collection("user")
}

func buildUserIndex() error {
	p := &User{}
	_, err := p.C().Indexes().CreateMany(context.TODO(), []mongo.IndexModel{
		{Keys: bson.D{{"Username", 1}}, Options: options.Index().SetUnique(true)},
	})
	return err
}
