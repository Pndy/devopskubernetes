const express = require('express')
const app = express()
const axios = require('axios')

const path = require('path')
const fs = require('fs')

const port = process.env.PORT || 3000
const imagePath = path.join(__dirname, 'public', 'image.jpg')


const todos = [
    {
        text: 'Todo 1'
    },
    {
        text: 'todo 2'
    }
]

app.use(express.json())


app.get('/image', async (req, res) => {
    await download()
    res.sendFile(imagePath)
})

app.get('/todos', (req, res) => {
    res.json(todos)
})

app.post('/todos', (req, res) => {
    const body = req.body

    if(!body.text){
        res.json({error: 'no todo included in request'})
    }

    const newTodo = {
        text: body.text
    }

    todos.push(newTodo)

    res.json(newTodo)
})


app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})

const download = async () =>  {
    const result = await fileExists()
    if(result.exists){
        const imgDate = new Date(result.stats.birthtimeMs)
        if(imgDate.getDate() !== new Date().getDate()){
            await deleteImage()
            await downloadNewImage()
        }
    }else{
        await downloadNewImage()
    }
}

const fileExists = async () => new Promise(res => {
    fs.stat(imagePath, (err, stats) => {
      if (err || !stats) return res({exists: false})

      return res({exists: true, stats})
    })
  })

const deleteImage = async () => new Promise(res => fs.unlink(imagePath, (err) => res()))

const downloadNewImage = async () => {
    const response = await axios.get('https://picsum.photos/300', { responseType: 'stream'})
    return new Promise(resolve => {
        const writer = fs.createWriteStream(imagePath)
        response.data.pipe(writer)
        writer.on('finish', resolve)
    })
}