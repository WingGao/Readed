package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/index"
)

type User struct {
	ent.Schema
}

// Fields of the Post.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.Uint("id"),
		field.String("account"),
		field.String("password"),
	}
}

func (User) Mixin() []ent.Mixin {
	return []ent.Mixin{
		TimeMixin{},
	}
}

func (User) Indexes() []ent.Index {
	return []ent.Index{
		index.Fields("account").Unique(),
	}
}
