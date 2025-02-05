package model

type BaseResp struct {
	Code int
	Msg  string      `json:",omitempty"`
	Data interface{} `json:",omitempty"`
}
