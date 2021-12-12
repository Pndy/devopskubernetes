const express = require('express')
const app = express()
const axios = require('axios')
const { Sequelize, Model, DataTypes } = require('sequelize')
const { createLightship } = require('lightship')
const NATS = require('nats')

const nc = NATS.connect({
    url: process.env.NATS_URL || 'nats://my-nats.default:4222'
})


const lightship = createLightship()

const path = require('path')
const fs = require('fs')

const port = process.env.PORT || 3000
const imagePath = path.join(__dirname, 'public', 'image.jpg')

const sequelize = new Sequelize(`postgres://postgres:${process.env.POSTGRES_PASSWORD}@postgres-svc.default:5432`)

const initDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.createSchema('tododb')
        console.log('Schema created')
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
initDB()

class Todo extends Model {}
Todo.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    schema: 'tododb',
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'todos'
})
Todo.sync({ alter: true })

app.use(express.json())


app.get('/image', async (req, res) => {
    await download()
    res.sendFile(imagePath)
})

app.get('/todos', async(req, res) => {
    const todos = await Todo.findAll()
    res.json(todos)
})

app.post('/todos', async (req, res) => {
    const body = req.body

    if(!body.text || body.text === ''){
        console.error('TODO ERROR: NOTEXT')
        res.status(400).json({ error: 'no todo included in request' })
        return
    }

    if(body.text.length > 140){
        console.error(`TODO ERROR TOOLONG: ${body.text}`)
        res.status(400).json({ error: 'todo length cannot exceed 140 characters' })
        return
    }

    const newTodo = await Todo.create({ text: body.text }) 
    console.info(`TODO ADDED: ${newTodo.text}`)

    nc.publish("todos", JSON.stringify(newTodo))

    res.json(newTodo)
})

app.put('/todos/:id', async (req, res) => {
    const body = req.body

    const todo = await Todo.findByPk(body.todo.id)
    if(todo===null){
        res.status(300).end()
        return
    }

    await Todo.update({ completed: body.todo.completed }, {
        where: {
            id: body.todo.id
        }
    })
    const todo2 = await Todo.findByPk(body.todo.id)

    nc.publish("todos", JSON.stringify(todo2))

    res.json(todo2)
})

app.get('/', async (req, res) => {
    res.status(200).end()
})

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
    lightship.signalReady()
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