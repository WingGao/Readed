package model

type LoginResp struct {
	UserID uint   `json:"UserID"`
	Token  string `json:"Token"`
}
