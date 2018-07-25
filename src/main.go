package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func uptimeServer(serverChan chan chan []byte) {
	var clients []chan []byte
	for {
		select {
		case client, _ := <-serverChan:
			clients = append(clients, client)
		case data, _ := <-mainChan:
			for x, c := range clients {
				c <- data
			}
		}
	}
}

var mainChan chan []byte

func HandleChan() chan []byte {
	for {
		data, ok := <-mainChan
		if !ok {

			fmt.Println("not oka")
			mainChan = make(chan []byte, 4096)
		} else {
			mainChan <- data
		}
	}
}

func MakeAndHandleMainChan() {
	mainChan = make(chan []byte, 4096)
	go HandleChan()
}

func main() {
	serverChan := make(chan chan []byte)
	MakeAndHandleMainChan()
	go uptimeServer(serverChan)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		ws, _ := upgrader.Upgrade(w, r, nil)
		client := make(chan []byte, 1024)
		serverChan <- client
		errChan := make(chan error, 1)
		go func(ws *websocket.Conn) {
			for {
				_, _, err := ws.ReadMessage()
				if err != nil {

					ws.Close()
					errChan <- err
					return
				}
				// do something with user message
			}
		}(ws)

		for {
			// global write to user through
			select {
			case <-errChan:
				return
			case text, _ := <-client:
				writer, _ := ws.NextWriter(websocket.TextMessage)
				writer.Write(text)
				writer.Close()
			}
		}
	})

	http.HandleFunc("/admin", func(w http.ResponseWriter, r *http.Request) {
		var conn, _ = upgrader.Upgrade(w, r, nil)
		// close(mainChan)
		go func(conn *websocket.Conn) {
			for {
				_, text, err := conn.ReadMessage()
				if err != nil {
					conn.Close()
					return
				}
				fmt.Println(len(mainChan))
				mainChan <- text
			}
		}(conn)
	})

	fmt.Println("Listening ", os.Args[1])
	http.ListenAndServe(os.Args[1], nil)
	fmt.Println("exited", os.Args[1])
}

type myStruct struct {
	Username string `json:"username"`
}
