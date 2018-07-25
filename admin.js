const ws = require('websocket').client

function test() {
    let start, end;
    let admin = new ws()
    admin.on('connect', function (conn) {
        conn.on('message', function (message) {
            if (message.type === 'utf8') {
                // console.log("Received: '" + message.utf8Data);
                console.log(message.utf8Data.split('|'))
            }
        });
        var stdin = process.openStdin();

        stdin.addListener("data", function (d) {
            start = Date.now()
            conn.sendUTF(d.toString().trim() + " | " + start.toString())
            // d.toString().trim()

        });
    })
    admin.connect("ws://localhost:3000/admin")


}

function tclient() {
    let client = new ws()
    client.on('connect', function (conn) {
        conn.on('message', function (message) {
            let end = Date.now()
            if (message.type === 'utf8') {

                time = message.utf8Data.split('|')
                console.log(end - +time[1], message.utf8Data)
            }
        });

        var stdin = process.openStdin();

        stdin.addListener("data", function (d) {
            start = Date.now()
            conn.sendUTF(d.toString().trim() + " | " + start.toString())
            // d.toString().trim()

        });
    })
    client.connect("ws://localhost:3000/")
}
if (process.argv[2] == 'admin') {
    console.log("admin")
    test()
}
else tclient()