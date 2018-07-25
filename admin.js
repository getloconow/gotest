const ws = require('websocket').client

function test() {
    let start, end;
    let admin = new ws()
    admin.on('connect', function (conn) {
        conn.on('message', function (message) {
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data);
            }
        });
        var stdin = process.openStdin();

        stdin.addListener("data", function (d) {
            start = Date.now()
            conn.sendUTF(d.toString().trim() + " | " + start.toString())
            // d.toString().trim()
            console.log("yes")
        });
    })
    admin.connect("ws://localhost:3000/admin")

    let client = new ws()
    client.on('connect', function (conn) {
        conn.on('message', function (message) {
            end = Date.now()
            let latency = end - start
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "', Time :", latency);
            }
        });
    })
    client.connect("ws://localhost:3000/")
}

test()