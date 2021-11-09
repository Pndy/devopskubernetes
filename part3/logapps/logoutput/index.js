const fs = require('fs/promises')
const express = require('express')
const app = express()
const axios = require('axios')
const port = process.env.PORT || 3000
require('dotenv').config()

app.get('/logs', async (req, res) => {
    try{
        const data = await fs.readFile('/usr/src/app/files/log.txt', 'utf-8')
        const response = await axios.get('http://pingpong-svc.default:80/pingpong')
        res.send(`${process.env.MESSAGE ? process.env.MESSAGE : 'message envvar not set..'}
                <br>${new Date().toISOString()}: ${data}
                <br />Ping / Pongs: ${response.data.split(' ')[1]}`)
    }catch(e){
        res.send(`Error: ${e}`)
    }
})

app.get('/', async (req,res) => {
    res.status(200).end()
})

app.listen(port, () => {})