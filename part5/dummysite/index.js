const express = require('express')
const request = require('request')
const app = express()
const port = process.env.PORT || 3000

let sitehtml
request(process.env.WEBSITE_URL, function(error, response, body) {
  console.error('error: ',error)
  sitehtml = body
})


app.get('/', (req, res) => {
  res.send(sitehtml)
})

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})