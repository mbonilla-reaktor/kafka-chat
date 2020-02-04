const kafka = require('kafka-node')
const Producer = kafka.Producer
const client = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });

const producer = new Producer(client);

module.exports = function(chatServer) {

    producer.on('ready', function () {
        console.log("Producer ready")
        chatServer.on('send-message',  (message) => {
            const messageString = JSON.stringify(message);
            console.log('Sending message ' + messageString );

            const kafkaMessage = {
                topic: 'chat-messages',
                messages : messageString
            };

            producer.send([kafkaMessage],  (err, data) => {
                console.log("kafka message", kafkaMessage)
                if(err) {
                    console.log('Error sending data ' + err);
                }
            });
        });
    });

    return {
        close : function() {
            console.log('Shutting down producer');
            console.log('Shutting down producer client');
            client.close(function() {
                console.log('Producer client closed');
            });

        }
    };
};