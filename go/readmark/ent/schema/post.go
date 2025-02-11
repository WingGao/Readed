package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

// Post holds the schema definition for the Post entity.
type Post struct {
	ent.Schema
}

// Fields of the Post.
func (Post) Fields() []ent.Field {
	return []ent.Field{
		field.Uint("id").StructTag(`json:"ID,omitempty"`),
		field.Uint("user_id").StructTag(`json:"UserID,omitempty"`),
		field.String("site").StructTag(`json:"Site,omitempty"`),
		field.String("path").StructTag(`json:"Path,omitempty"`).Optional(),
		field.String("pid").Comment("站内ID").StructTag(`json:"Pid,omitempty"`),
		field.String("read_last_reply_id").StructTag(`json:"ReadLastReplyID,omitempty"`).Optional(),
		field.Int("read_last_reply_index").Comment("帖子内楼层").StructTag(`json:"ReadLastReplyIndex,omitempty"`).
			SchemaType(map[string]string{dialect.MySQL: "int"}).Optional(),
		field.Time("read_last_reply_time").StructTag(`json:"ReadLastReplyTime,omitempty"`).
			SchemaType(map[string]string{dialect.MySQL: "datetime"}).Optional(),
		field.Bool("mark_banned").StructTag(`json:"MarkBanned,omitempty"`).Optional(),
	}
}

func (Post) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

// Edges of the Post.
func (Post) Edges() []ent.Edge {
	return nil
}

func (Post) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("user_id", "site", "pid").Unique(),
	}
}
