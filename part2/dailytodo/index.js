const axios = require('axios')
const { Sequelize, Model, DataTypes } = require('sequelize')

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
    }
}, {
    schema: 'tododb',
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'todos'
})

const getDaily = async () => {
    const response = await axios.get('https://en.wikipedia.org/wiki/Special:Random')
    return response.request.res.responseUrl
}

const addTodo = async () => {
    const newTodo = await Todo.create({ 
        text: `${new Date().toISOString().split('T')[0]}: ${await getDaily()}`
    })
}


const main = async () => {
    await initDB()
    await Todo.sync()
    await addTodo()
    await sequelize.close()
}
main()