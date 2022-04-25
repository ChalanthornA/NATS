package models

type User struct {
	Name string `bson:"name"`
	Age  string `bson:"age"`
}
