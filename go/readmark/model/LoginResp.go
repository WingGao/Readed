package model

type LoginResp struct {
	UserID string `json:"UserID"`
	Token  string `json:"Token"`
}
