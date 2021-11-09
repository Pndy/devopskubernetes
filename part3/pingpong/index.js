const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const { Sequelize, Model, DataTypes } = require('sequelize')

const sequelize = new Sequelize(`postgres://postgres:${process.env.POSTGRES_PASSWORD}@postgres-svc.default:5432`)

const initDB = async() => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.createSchema('pingpong')
        console.log('Schema created')
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
initDB()

class Ping extends Model {}
Ping.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ping: {
        type: DataTypes.INTEGER
    }
}, {
    schema: 'pingpong',
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'pings'
})

Ping.sync()

let counter
const setupCounter = async () => {
    try{
        counter = await Ping.count()
    } catch(e){
        counter = 0
    }
}
setupCounter()

app.get('/', async (req, res) => {
    counter++
    await Ping.create({ ping: 1 })
    res.send(`pong ${counter}`)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})