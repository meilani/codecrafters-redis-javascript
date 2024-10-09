const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  
    connection.on('data', data => {
        const dataArr = data.toString().split(/[\r\n|\r|\n]+/)

        if (dataArr.find(el => el.toUpperCase() === 'PING')) {
            connection.write('+PONG\r\n')
        }
        if (dataArr.find(el => el.toUpperCase() === 'ECHO')) {
            const idx = dataArr.findIndex(el => el.toUpperCase() === 'ECHO') 
            const str = `${dataArr[idx + 1]}\r\n${dataArr[idx + 2]}\r\n`

            connection.write(str)
        }
    })
});

server.listen(6379, "127.0.0.1");
