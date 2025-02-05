package db

import (
	"context"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type Post struct {
	ID                 bson.ObjectID `bson:"_id"`
	Site               string        `bson:"Site"`
	Path               string        `bson:"Path"`
	Pid                int           `bson:"Pid"`    // 站内文章ID
	PidStr             *string       `bson:"PidStr"` // 站内文章ID字符串
	UpdatedAt          time.Time     `bson:"UpdateAt"`
	ReadLastReplyId    int           `bson:"ReadLastReplyId"`    // 最后一次读取的回复ID
	ReadLastReplyIndex int           `bson:"ReadLastReplyIndex"` // 最后一次读取的回复的序号
}

func (p *Post) C() *mongo.Collection {
	return MainDB.Collection("post")
}

func buildPostIndex() error {
	p := &Post{}
	_, err := p.C().Indexes().CreateMany(context.TODO(), []mongo.IndexModel{
		{Keys: bson.D{{"Site", 1}}},
		{Keys: bson.D{{"Pid", 1}}},
		{Keys: bson.D{{"PidStr", 1}}},
	})
	return err
}
