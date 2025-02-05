package db

import (
	"context"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"time"
)

type Post struct {
	ID                 bson.ObjectID `bson:"_id" json:",omitempty"`
	UserID             bson.ObjectID `bson:"UserID" json:",omitempty"`
	Site               string        `bson:"Site" json:",omitempty"`
	Path               string        `bson:"Path" json:",omitempty"`
	Pid                int           `bson:"Pid" json:",omitempty"`    // 站内文章ID,要求site范围内唯一
	PidStr             *string       `bson:"PidStr" json:",omitempty"` // 站内文章ID字符串
	UpdatedAt          time.Time     `bson:"UpdateAt" json:",omitempty"`
	ReadLastReplyId    int           `bson:"ReadLastReplyId" json:",omitempty"`    // 最后一次读取的回复ID
	ReadLastReplyIndex int           `bson:"ReadLastReplyIndex" json:",omitempty"` // 最后一次读取的回复的序号
	MarkBanned         *bool         `bson:"MarkDeleted" json:",omitempty"`        // 标记为不看
}

func (p *Post) C() *mongo.Collection {
	return MainDB.Collection("post")
}

func buildPostIndex() error {
	p := &Post{}
	_, err := p.C().Indexes().CreateMany(context.TODO(), []mongo.IndexModel{
		{Keys: bson.D{{"UserID", 1}}},
		{Keys: bson.D{{"Site", 1}}},
		{Keys: bson.D{{"Pid", 1}}},
		{Keys: bson.D{{"PidStr", 1}}},
	})
	return err
}
