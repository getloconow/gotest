const ws = require('websocket').client
let data = {}
function test(port) {
    let start, end;
    let admin = new ws()
    admin.on('connect', function (conn) {
        conn.on('message', function (message) {
            let end = Date.now()
            if (message.type === 'utf8') {
                // console.log("Received: '" + message.utf8Data);
                time = message.utf8Data.split('|')

                console.log(end - +time[1], message.utf8Data)

            }
        });
        start = Date.now()
        conn.sendUTF(port + " | " + start.toString())
        // d.toString().trim()
    })
    console.log(`ws://13.127.173.119:${port}/admin`)
    admin.connect(`ws://13.127.173.119:${port}/admin`)
}

function tclient(id, port) {
    let client = new ws()
    client.on('connect', function (conn) {
        conn.on('message', function (message) {
            let end = Date.now()
            if (message.type === 'utf8') {

                time = message.utf8Data.split('|')
                console.log(end - +time[1], message.utf8Data)
                data[id] = end - +time[1]
            }
        });

        var stdin = process.openStdin();

        stdin.addListener("data", function (d) {
            start = Date.now()
            conn.sendUTF(d.toString().trim() + " | " + start.toString())
            // d.toString().trim()

        });
    })

    client.connect(`ws://13.127.173.119:${port}/`)
}

ps = 30
pps = 400
if (process.argv[2] == 'admin') {
    console.log("admin")
    for (let port = 3000; port < 3000 + ps; port++)
        test(port)
}
else {
    process.setMaxListeners(500)
    let i = 0
    for (let port = 3000; port < 3000 + ps; port++) {
        let limit = i + pps
        for (; i < limit; i++) {
            tclient(i, port)
        }
    }
    setInterval(function () {
        // console.log(Object.values(data))
        console.log("-------------------")
        let vals = array(Object.values(data))
        console.log(min(vals))
        console.log(max(vals))
        console.log(sum(vals) / vals.length)
        console.log(vals.length)

    }, 7000)

}

function array(x) {
    let t = []
    for (let i in x) {
        t.push(x[i])
    }
    return t
}
function sum(x) {
    t = 0
    for (let i in x) {
        t += x[i]
    }
    return t
}

function max(x) {
    t = -1
    for (let i in x) {
        t = x[i] > t ? x[i] : t
    }
    return t
}

function min(x) {
    t = Infinity
    for (let i in x) {
        t = x[i] < t ? x[i] : t
    }
    return t
}


