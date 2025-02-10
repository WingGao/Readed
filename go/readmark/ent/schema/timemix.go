package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect"
	"entgo.io/ent/schema/field"
	"entgo.io/ent/schema/mixin"
)

type TimeMixin struct {
	mixin.Schema
}

func (TimeMixin) Fields() []ent.Field {
	return []ent.Field{
		field.Time("created_at").StructTag(`json:"CreatedAt,omitempty"`).SchemaType(map[string]string{dialect.MySQL: "datetime"}).
			Immutable().
			Default(time.Now),
		field.Time("updated_at").StructTag(`json:"UpdatedAt,omitempty"`).SchemaType(map[string]string{dialect.MySQL: "datetime"}).
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}
