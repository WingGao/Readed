package controller

import (
	"github.com/WingGao/webutils/fiber3/flogger"
	. "readmark/ent"
	userSc "readmark/ent/user"
	. "readmark/model"

	"github.com/WingGao/webutils/werror"
	"github.com/gofiber/fiber/v3/middleware/session"
	"github.com/gookit/goutil/errorx"
)

func handleUserLogin(c *FiberCtxExt) LoginResp {
	req := ParseForm(c, &User{})
	werror.PanicError(
		validate.Var(req.Account, "required"),
	)
	user, err := EntClient.User.Query().Where(userSc.AccountEQ(req.Account)).Only(c.Context())
	flogger.WithFiberIfError(c, err)
	if user != nil && user.Account == req.Account {
		// 成功
		user.Password = ""
		sess := session.FromContext(c)
		sess.Reset()
		sess.Set(SessionUserIdKey, user.ID)
		return LoginResp{UserID: user.ID, Token: sess.ID()}
	} else {
		panic(errorx.E("用户名或密码错误"))
	}
}

func handleUserInfo(c *FiberCtxExt) User {
	_, uid := assertSession(c)
	return User{ID: uid}
}
