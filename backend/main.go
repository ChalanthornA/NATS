package main

import (
	"backend/services"
)

func main(){
	// services.TestQueueSub("cat", "q")
	// services.TestManualAck("cat")
	services.NatsSub("cat")
}