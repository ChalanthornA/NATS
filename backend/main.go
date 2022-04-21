package main

import (
	"backend/config"
	"backend/services"
)

func main(){
	services.NatsSub("p.p")
	defer config.NC.Close()
}