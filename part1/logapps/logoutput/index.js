const fs = require('fs')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/logs', (req, res) => {
    let data = fs.readFileSync('/usr/src/app/files/log.txt', 'utf-8')
    res.send(`${new Date().toISOString()}: ${data}`)
})

app.listen(port, () => {})