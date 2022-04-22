package services

import (
	"backend/config"
	"backend/models"
	"context"

	"go.mongodb.org/mongo-driver/mongo"
)

var testCollection *mongo.Collection = config.CreateCollection("test")

var userCollection *mongo.Collection = config.CreateCollection("user")

func InsertToTestCollection(msg string){
	tm := models.TestModel{Message: msg}

	_, err := testCollection.InsertOne(context.TODO(), tm)
	if err != nil {
		panic(err)
	}
}

func InsertToUserCollection(userInfo models.User){
	_, err := userCollection.InsertOne(context.TODO(), userInfo)
	if err != nil{
		panic(err)
	}
}