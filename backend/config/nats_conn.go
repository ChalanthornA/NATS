package config

import (
	"fmt"
	"log"
	
	"github.com/nats-io/nats.go"
)

var JS nats.JetStreamContext = NatsConn()

func NatsConn() nats.JetStreamContext{
	nc, err := nats.Connect(nats.DefaultURL)
	if err != nil{
		log.Fatal(err)
	}
	fmt.Printf("Connect to %s\n", nats.DefaultURL)
	js, _ := nc.JetStream()
	js.AddStream(&nats.StreamConfig{
		Name:     "Meow",
		Subjects: []string{"cat"},
	})
	js.AddStream(&nats.StreamConfig{
		Name:     "Info",
		Subjects: []string{"info"},
	})
	js.AddConsumer("Meow", &nats.ConsumerConfig{
		Durable: "MONITOR",
	})
	return js
}