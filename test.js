const ws = require('websocket').client
let socks = []


let count = 0;
let max = 0;
function test(addr) {
    let y = new ws()
    y.on('connect', function (conn) {
        let start = 0
        let end = 0

        conn.on('message', function (message) {
            end = Date.now()
            count += 1
            max = max > end - start ? max : end - start
            console.log(max, end, start)
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'", count);

            }
        });
        setTimeout(function () {
            start = Date.now()
            conn.sendUTF(JSON.stringify({ "message": "hello !", "username": "junaid1460" }))
        }, 5000)
    })
    y.connect(addr)
}
let addrs = []
for (let port of process.argv.slice(2)) {
    addrs.push(`ws://13.127.173.119:${port}/ws`)
}
for (let i = 0; i < 1000; i++) {
    for (let addr of addrs) test(addr)
}

