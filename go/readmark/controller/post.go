package controller

import (
	"fmt"
	"github.com/WingGao/webutils/wbson"
	"github.com/WingGao/webutils/werror"
	"github.com/gofiber/fiber/v3"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	. "readmark/db"
	"time"
)

func handlePostMark(c fiber.Ctx) *Post {
	_, uid := assertSession(c)
	req := ParseJson(c, &Post{})
	werror.PanicError(
		validate.Var(req.Site, "required"),
		validate.Var(req.Pid, "required"),
	)
	old := &Post{}
	lKey := fmt.Sprintf("readmark:post:lock:save:%s_%s_%d", uid, req.Site, req.Pid)
	lock, _ := RedisLocker.Obtain(c.Context(), lKey, 3*time.Minute, nil)
	defer lock.Release(c.Context())
	old.C().FindOne(c.Context(),
		bson.D{{"UserID", wbson.NewObjectIdHex(uid)}, {"Site", req.Site}, {"Pid", req.Pid}}).Decode(old)
	if old.ID.IsZero() { //新增
		old.ID = bson.NewObjectID()
		old.UserID = wbson.NewObjectIdHex(uid)
		old.Site = req.Site
		old.Path = req.Path
		old.Pid = req.Pid
		old.PidStr = req.PidStr
	} else {
		//更新
	}
	old.MarkBanned = req.MarkBanned
	old.UpdatedAt = time.Now()
	old.ReadLastReplyId = req.ReadLastReplyId
	old.ReadLastReplyIndex = req.ReadLastReplyIndex
	old.C().UpdateByID(c.Context(), old.ID, bson.D{{"$set", old}}, options.UpdateOne().SetUpsert(true))
	return old
}
