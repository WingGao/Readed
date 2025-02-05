package config

import (
	"github.com/WingGao/webutils/werror"
	"github.com/goccy/go-yaml"
	"github.com/gookit/goutil/fsutil"
)

var GlobalConfig *AppConfig

type AppConfig struct {
	Mongo AppMongoConfig `yaml:"mongo"`
}

type AppMongoConfig struct {
	Uri string `yaml:"uri"`
	DB  string `yaml:"db"`
}

func Init(f string) {
	fs := fsutil.ReadFile(f)
	GlobalConfig = &AppConfig{}
	werror.PanicError(yaml.Unmarshal(fs, GlobalConfig))
}
