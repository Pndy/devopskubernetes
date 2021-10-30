const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const genStr = () => {
    return Math.random().toString(32).substr(2, 10);
}

let hash = `${genStr()}-${genStr()}-${genStr()}`

setInterval(() => {
    hash = `${genStr()}-${genStr()}-${genStr()}`
    console.log(`${new Date().toISOString()}: ${hash}`)
}, 5000)

app.get('/logs', (req, res) => {
    res.send(`${new Date().toISOString()}: ${hash}`)
})

app.listen(port, () => {})