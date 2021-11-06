const fs = require('fs')

const genStr = () => {
    return Math.random().toString(32).substr(2, 10);
}

let hash = `${genStr()}-${genStr()}-${genStr()}`
fs.writeFileSync('/usr/src/app/files/log.txt', hash)

setInterval(() => {
    //hash = `${genStr()}-${genStr()}-${genStr()}`
    console.log(`${new Date().toISOString()}: ${hash}`)
}, 5000)

