package controller

import (
	. "readmark/ent"
	postSc "readmark/ent/post"

	"github.com/WingGao/webutils/werror"
)

func handlePostMark(c *FiberCtxExt) *Post {
	_, uid := assertSession(c)
	req := ParseJson(c, &PostOpt{})
	werror.PanicError(
		validate.Var(req.Site, "required"),
		validate.Var(req.Pid, "required"),
	)
	werror.PanicError(TxWrap(c.Context(), func(tx *Tx) error {
		old, _ := tx.Post.Query().WhereUserSitePid(uid, *req.Site, req.Pid).Only(c.Context())
		if old == nil { //新增
			old = tx.Post.Create().SetUserID(uid).SetSite(*req.Site).SetPid(*req.Pid).SaveX(c.Context())
		}
		_, err := tx.Post.UpdateOne(old).SetNillableMarkBanned(req.MarkBanned).SetNillableReadLastReplyID(req.ReadLastReplyID).SetNillableReadLastReplyIndex(
			req.ReadLastReplyIndex).SetNillableReadLastReplyTime(req.ReadLastReplyTime).Save(c.Context())
		return err
	}))
	return EntClient.Post.Query().WhereUserSitePid(uid, *req.Site, req.Pid).OnlyX(c.Context())
}

type PostSearchReq struct {
	Site    string
	PidList []string
}

// 查询用户的文章
func handlePostSearch(c *FiberCtxExt) (posts []*Post) {
	req := ParseJson(c, &PostSearchReq{})

	if len(req.PidList) == 0 {
		return
	}

	posts, _ = EntClient.Post.Query().Where(
		postSc.UserIDEQ(c.Uid()),
		postSc.SiteEQ(req.Site),
		postSc.PidIn(req.PidList...),
	).All(c.Context())
	return
}
