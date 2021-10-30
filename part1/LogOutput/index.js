const genStr = () => {
    return Math.random().toString(32).substr(2, 10);
}

let hash = `${genStr()}-${genStr()}-${genStr()}`

setInterval(() => {
    console.log(`${new Date().toISOString()}: ${hash}`)
}, 5000)