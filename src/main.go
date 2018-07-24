package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello"))
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		var conn, _ = upgrader.Upgrade(w, r, nil)
		go func(conn *websocket.Conn) {
			for {
				_, _, err := conn.ReadMessage()
				if err != nil {
					conn.Close()
				}
			}
		}(conn)

		go func(conn *websocket.Conn) {
			ch := time.Tick(5 * time.Second)

			for range ch {
				conn.WriteJSON(myStruct{
					Username:  "mvansickle",
					FirstName: "Michael",
					LastName:  "Van Sickle",
				})
			}
		}(conn)
	})

	http.ListenAndServe(os.Args[1], nil)
	fmt.Println("exited", os.Args[1])
}

type myStruct struct {
	Username  string `json:"username"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}
