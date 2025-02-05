package controller

import (
	"github.com/WingGao/webutils/wbson"
	"github.com/WingGao/webutils/werror"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/session"
	"github.com/gookit/goutil/errorx"
	"go.mongodb.org/mongo-driver/v2/bson"
	. "readmark/db"
	. "readmark/model"
)

func handleUserLogin(c fiber.Ctx) LoginResp {
	req := ParseForm(c, &User{})
	werror.PanicError(
		validate.Var(req.Username, "required"),
	)
	user := &User{}
	req.C().FindOne(c.Context(), bson.D{{"Username", req.Username}}).Decode(&user)
	if user.Username == req.Username {
		// 成功
		user.Password = ""
		sess := session.FromContext(c)
		sess.Reset()
		sess.Set(SessionUserIdKey, user.ID.Hex())
		return LoginResp{UserID: user.ID.Hex(), Token: sess.ID()}
	} else {
		panic(errorx.E("用户名或密码错误"))
	}
}

func handleUserInfo(c fiber.Ctx) User {
	_, uid := assertSession(c)
	return User{ID: wbson.NewObjectIdHex(uid)}
}
