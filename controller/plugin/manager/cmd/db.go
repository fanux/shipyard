package cmd

import (
	"fmt"
	"log"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

func initDB(host, port, user, dbname, passwd string) {
	db, err := gorm.Open("postgres",
		fmt.Sprintf("host=%s port=%s user=%s dbname=%s sslmode=disable password=%s",
			host, port, user, dbname, passwd))

	if err != nil {
		log.Print("error init db", err)
		return
	}

	if !db.HasTable(&Plugin{}) {
		db.CreateTable(&Plugin{})
		db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&Plugin{})
	} else {
		log.Print("plugins table already exist")
	}

	defer db.Close()
}
