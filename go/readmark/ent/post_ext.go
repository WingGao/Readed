package ent

// 自定义查询
import "readmark/ent/post"

func (pq *PostQuery) WhereUserSitePid(uid uint, site string, pid *string) *PostQuery {
	pq.Where(post.UserIDEQ(uid), post.SiteEQ(site))
	if pid != nil {
		pq.Where(post.PidEQ(*pid))
	}
	return pq
}
