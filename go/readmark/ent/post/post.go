// Code generated by ent, DO NOT EDIT.

package post

import (
	"entgo.io/ent/dialect/sql"
)

const (
	// Label holds the string label denoting the post type in the database.
	Label = "post"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldCreatedAt holds the string denoting the created_at field in the database.
	FieldCreatedAt = "created_at"
	// FieldUpdatedAt holds the string denoting the updated_at field in the database.
	FieldUpdatedAt = "updated_at"
	// FieldUserID holds the string denoting the user_id field in the database.
	FieldUserID = "user_id"
	// FieldSite holds the string denoting the site field in the database.
	FieldSite = "site"
	// FieldPath holds the string denoting the path field in the database.
	FieldPath = "path"
	// FieldPid holds the string denoting the pid field in the database.
	FieldPid = "pid"
	// FieldReadLastReplyID holds the string denoting the read_last_reply_id field in the database.
	FieldReadLastReplyID = "read_last_reply_id"
	// FieldReadLastReplyIndex holds the string denoting the read_last_reply_index field in the database.
	FieldReadLastReplyIndex = "read_last_reply_index"
	// FieldReadLastReplyTime holds the string denoting the read_last_reply_time field in the database.
	FieldReadLastReplyTime = "read_last_reply_time"
	// FieldMarkBanned holds the string denoting the mark_banned field in the database.
	FieldMarkBanned = "mark_banned"
	// Table holds the table name of the post in the database.
	Table = "posts"
)

// Columns holds all SQL columns for post fields.
var Columns = []string{
	FieldID,
	FieldCreatedAt,
	FieldUpdatedAt,
	FieldUserID,
	FieldSite,
	FieldPath,
	FieldPid,
	FieldReadLastReplyID,
	FieldReadLastReplyIndex,
	FieldReadLastReplyTime,
	FieldMarkBanned,
}

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	return false
}

// OrderOption defines the ordering options for the Post queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByCreatedAt orders the results by the created_at field.
func ByCreatedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldCreatedAt, opts...).ToFunc()
}

// ByUpdatedAt orders the results by the updated_at field.
func ByUpdatedAt(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldUpdatedAt, opts...).ToFunc()
}

// ByUserID orders the results by the user_id field.
func ByUserID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldUserID, opts...).ToFunc()
}

// BySite orders the results by the site field.
func BySite(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldSite, opts...).ToFunc()
}

// ByPath orders the results by the path field.
func ByPath(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldPath, opts...).ToFunc()
}

// ByPid orders the results by the pid field.
func ByPid(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldPid, opts...).ToFunc()
}

// ByReadLastReplyID orders the results by the read_last_reply_id field.
func ByReadLastReplyID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldReadLastReplyID, opts...).ToFunc()
}

// ByReadLastReplyIndex orders the results by the read_last_reply_index field.
func ByReadLastReplyIndex(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldReadLastReplyIndex, opts...).ToFunc()
}

// ByReadLastReplyTime orders the results by the read_last_reply_time field.
func ByReadLastReplyTime(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldReadLastReplyTime, opts...).ToFunc()
}

// ByMarkBanned orders the results by the mark_banned field.
func ByMarkBanned(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldMarkBanned, opts...).ToFunc()
}
