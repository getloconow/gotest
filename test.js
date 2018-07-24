const ws = require('websocket').client
let socks = []


let count = 0;
let max = 0;
function test(addr) {
    let y = new ws()
    count = 0
    y.on('connect', function (conn) {
        let start = 0
        let end = 0
        count += 1
        conn.on('message', function (message) {
            end = Date.now()

            max = max > end - start ? max : end - start
            // console.log(max, end, start)
            console.log(count, addr)
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'", count);

            }
        });
        setInterval(function () {
            start = Date.now()
            conn.sendUTF(JSON.stringify({ "message": "hello !", "username": "junaid1460" }))
        }, 5000)
    })
    y.connect(addr)
}
let addrs = []
for (let i = 3000; i < 3000 + 40; i++) {
    addrs.push(`ws://13.127.173.119:${i}/ws`)
}
for (let i = 0; i < 300; i++) {
    for (let addr of addrs) test(addr)
}

