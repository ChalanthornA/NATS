package services

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"fmt"
	"runtime"

	"github.com/nats-io/nats.go"
)

var js nats.JetStreamContext = config.JS

func TestManualAck(subject string){
	js.Subscribe(subject, func(msg *nats.Msg){
		fmt.Printf("%s\n", string(msg.Data))
		msg.Ack()
	}, nats.Durable("MONITOR"), nats.ManualAck())

	runtime.Goexit()
}

func NatsSub(subject string){
	js.Subscribe(subject, func(msg *nats.Msg){
		InsertToTestCollection(string(msg.Data))
		fmt.Println(string(msg.Data))
	}, nats.Durable("MONITOR"))

	js.Subscribe("info", func(msg *nats.Msg){
		user := models.User{}
		json.Unmarshal(msg.Data, &user)
		InsertToUserCollection(user)
		msg.Ack()
		fmt.Printf("%+v\n", user)
	}, nats.Durable("MONITOR"), nats.ManualAck())
	
	runtime.Goexit()
}