const net = require("net");

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
    const setObj = {}
    connection.on('data', data => {

        const dataArr = data.toString().split(/[\r\n|\r|\n]+/);
        const currentTime = Date.now();
        
        if (dataArr.find(el => el.toUpperCase() === 'PING')) {
            connection.write('+PONG\r\n')
        }
        if (dataArr.find(el => el.toUpperCase() === 'ECHO')) {
            const idx = dataArr.findIndex(el => el.toUpperCase() === 'ECHO') 
            const str = `${dataArr[idx + 1]}\r\n${dataArr[idx + 2]}\r\n`

            connection.write(str)
        }
        if (dataArr.find(el => el.toUpperCase() === 'SET')) {
            const idx = dataArr.findIndex(el => el.toUpperCase() === 'SET') 
            const key = dataArr[idx + 2];
            setObj[key] = {}
            setObj[key]['value'] = dataArr[idx + 4]
            setObj[key]['px'] = dataArr[idx + 8] || null;
            setObj[key]['currentTime'] = currentTime;
            const str = '+OK\r\n'

            connection.write(str)
        }
        if (dataArr.find(el => el.toUpperCase() === 'GET')) {
            const idx = dataArr.findIndex(el => el.toUpperCase() === 'GET')
            const key = dataArr[idx + 2];
            let str = '$-1\r\n';
            const timeDiff = currentTime - setObj[key]['currentTime'];
            
            if (setObj[key]['px'] && (timeDiff > setObj[key]['px'] )) {
                delete setObj[key]
            }
            if (Object.hasOwn(setObj, key)) {
                let val = setObj[key]['value']
                str = `$${val.length}\r\n${val}\r\n`
            } 

            connection.write(str)
        }
    })
});

server.listen(6379, "127.0.0.1");
