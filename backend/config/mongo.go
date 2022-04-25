package config

import (
	"context"
	"fmt"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const MONGOURL = "mongodb://localhost:27017"
var Mgc *mongo.Client = MongoConn()

func MongoConn() *mongo.Client{
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(MONGOURL))
	if err != nil{
		panic(err)
	}
	if err := client.Ping(context.TODO(), readpref.Primary()); err != nil {
        panic(err)
	}
	fmt.Printf("Connect to %s\n", MONGOURL)
	return client
}

func CreateCollection(collectionName string) *mongo.Collection{
	return Mgc.Database("nats").Collection(collectionName)
}