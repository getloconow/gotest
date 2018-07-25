const ws = require('websocket').client
let socks = []
const os = require("os")
let count = 0;
let max = 0;
function test2(addr) {
    let y = new ws()
    y.on('connect', function (conn) {
        let start = 0
        let end = 0
        count += 1
        conn.on('message', function (message) {
            end = Date.now()
            max = max > end - start ? max : end - start
            console.log(max, end, start, end - start)
            // console.log(count, addr)
            if (message.type === 'utf8') {
                console.log("Received: '" + message.utf8Data + "'", count);
            }
        });

        start = Date.now()
        conn.sendUTF(JSON.stringify({ "message": "hello !", "username": "junaid1460" }))
    })
    y.connect(addr)
}



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
            conn.sendUTF(d.toString().trim() + " | " + start.toLocaleString())
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
                console.log("Received: '" + message.utf8Data + "', Time :", );
            }
        });
    })
    client.connect("ws://localhost:3000/")
}

let addrs = []
for (let i = 3000; i < 3000 + 30; i++) {
    addrs.push(`ws://13.127.173.119:${i}/wsl`)
}
i = 400

function tt() {
    for (let addr of addrs) test(addr)
    if (i > 0)
        setTimeout(tt, 10)
    i -= 1
}
setTimeout(tt, 10)