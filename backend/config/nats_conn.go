package config

import (
	"fmt"
	"log"

	"github.com/nats-io/nats.go"
)

var NC *nats.Conn = NatsConn()

func NatsConn() *nats.Conn{
	nc, err := nats.Connect(nats.DefaultURL)
	if err != nil{
		log.Fatal(err)
	}
	fmt.Printf("connect to %s\n", nats.DefaultURL)
	return nc
}