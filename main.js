const ws = require('websocket').client


let y = new ws()
y.on('connect', function (conn) {
    conn.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data);
        }
    });
})
y.connect("ws://localhost:3000")

