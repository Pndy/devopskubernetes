const NATS = require('nats')

const nc = NATS.connect({
    url: process.env.NATS_URL || 'nats://my-nats:4222'
})


nc.subscribe("todos", { queue: 'consumer.workers' }, (todo) => {
    const payload = JSON.parse(todo)

    console.log(payload)
})