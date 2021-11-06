const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let counter
try{
    counter = fs.readFileSync('/usr/src/app/files/pings.txt', 'utf-8')
} catch(e){
    counter = 0
    fs.writeFileSync('/usr/src/app/files/pings.txt', '0')
}

app.get('/', (req, res) => {
    counter++
    fs.writeFileSync('/usr/src/app/files/pings.txt', counter.toString())
    res.send(`pong ${counter}`)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})