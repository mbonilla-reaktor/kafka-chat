const chat = require("./lib/chat");

const app = require('express')()
const next = require('next')
const server = require("http").Server(app);

const consumer = require("./lib/consumer")
const producer = require("./lib/producer")

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({dev})
const handle = nextApp.getRequestHandler()

const chatServer = chat(server)

const groupId = 'chat-server-group';
const kafkaConsumer = consumer(chatServer, groupId);
const kafkaProducer = producer(chatServer);

nextApp.prepare()
    .then(() => {
        app.get('*', (req, res) => {
            return handle(req, res)
        })
        server.listen(3000, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:3000')
        })
    })
    .catch((ex) => {
        console.error(ex.stack)
        process.exit(1)
    })

process.on("SIGINT", function () {
    console.log('Shutting down');
    kafkaConsumer.close();
    kafkaProducer.close();
    process.exit();
});