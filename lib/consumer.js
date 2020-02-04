const kafka = require('kafka-node')
const Consumer = kafka.Consumer
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const messages = []

module.exports = (chatServer, groupId) => {
    const consumer = new Consumer(
        client,
        [
            { topic: 'chat-messages' }
        ],
        {
            groupId: groupId,
            autoCommit: true,
            autoCommitIntervalMs: 5000
        }
    );

    // Consumer receives a message
    consumer.on('message',  (kafkaMessage) => {
        console.log('Received message ' + kafkaMessage.value);
        const message = JSON.parse(kafkaMessage.value);
        messages.push(message)
        chatServer.broadcast(messages);
    });

    return {
        close : function() {
            console.log('Shutting down consumer');
            consumer.close(false, function() {
                console.log('Consumer closed');
                console.log('Shutting down consumer client');
                client.close(function() {
                    console.log('Consumer Client closed');
                });
            });
        }
    };
};