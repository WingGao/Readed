package ent

import (
	"context"
)

var (
	EntClient *Client = nil
)

func TxWrap(c context.Context, fn func(tx *Tx) error) error {
	tx, err := EntClient.Tx(c)
	if err != nil {
		return err
	}
	defer func() {
		if err := recover(); err != nil {
			tx.Rollback()
		}
	}()
	err = fn(tx)
	if err != nil {
		tx.Rollback()
		return err
	}
	return tx.Commit()
}
