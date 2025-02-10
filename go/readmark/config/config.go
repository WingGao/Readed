package config

import (
	"github.com/WingGao/webutils/werror"
	"github.com/goccy/go-yaml"
	"github.com/gookit/goutil/fsutil"
)

var GlobalConfig *AppConfig

type AppConfig struct {
	Addr  string         `yaml:"addr"`
	Mongo AppMongoConfig `yaml:"mongo"`
	Mysql AppMysqlConfig `yaml:"mysql"`
	Redis AppRedisConfig `yaml:"redis"`
}

type AppMongoConfig struct {
	Uri string `yaml:"uri"`
	DB  string `yaml:"db"`
}

type AppMysqlConfig struct {
	Uri string `yaml:"uri"`
}

type AppRedisConfig struct {
	Host     string `yaml:"host"`
	Port     int    `yaml:"port"`
	DB       int    `yaml:"db"`
	Password string `yaml:"password"`
}

func Init(f string) {
	fs := fsutil.ReadFile(f)
	GlobalConfig = &AppConfig{}
	werror.PanicError(yaml.Unmarshal(fs, GlobalConfig))
}
