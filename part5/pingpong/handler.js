'use strict'
const { Sequelize, Model, DataTypes } = require('sequelize')
const fs = require('fs').promises
const postgrespass = "/var/openfaas/secrets/pg-password"

const initDB = async(sequelize) => {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      await sequelize.createSchema('pingpong')
      console.log('Schema created')
  } catch (error) {
      console.error('Unable to connect to the database:', error);
  }
}

module.exports = async (event, context) => {
  let pgpassword = await fs.readFile(postgrespass, "utf-8")
  const sequelize = new Sequelize(`postgres://postgres:${pgpassword}@postgres-svc.default:5432`)

  await initDB(sequelize)

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

  await Ping.sync()

  let counter = await Ping.count()
  await Ping.create({ ping: 1 })

  const result = {
    'pongs': JSON.stringify(counter),
  }

  return context
    .status(200)
    .succeed(result)
}
