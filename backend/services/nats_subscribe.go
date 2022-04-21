package services

import (
	"backend/config"
	"fmt"
	"runtime"

	"github.com/nats-io/nats.go"
)

func NatsSub(subject string){
	nc := config.NC
	nc.Subscribe(subject, func(msg *nats.Msg){
		fmt.Println(string(msg.Data))
	})

	runtime.Goexit()
}