const fs = require('fs/promises')
const express = require('express')
const app = express()
const axios = require('axios')
const port = process.env.PORT || 3000

app.get('/logs', async (req, res) => {
    try{
        const data = await fs.readFile('/usr/src/app/files/log.txt', 'utf-8')
        const response = await axios.get('http://pingpong-svc.apps-ns:1236')
        res.send(`${new Date().toISOString()}: ${data}<br />Ping / Pongs: ${response.data.split(' ')[1]}`)
    }catch(e){
        res.send(`Error: ${e}`)
    }
    
})

app.listen(port, () => {})