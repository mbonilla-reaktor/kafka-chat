const kafka = require('kafka-node')
const Producer = kafka.Producer
const client = new kafka.KafkaClient({ kafkaHost: 'ec2-34-242-28-204.eu-west-1.compute.amazonaws.com:9092' });

const producer = new Producer(client);
const topic = 'chat-messages'
module.exports = function(chatServer) {

    producer.on('ready', function () {
        console.log("Producer ready")
        producer.createTopics([topic], false, (err, data) => {
            if (err) {
                console.log("error creating topic", err);
            }
        });
        chatServer.on('send-message',  (message) => {
            const messageString = JSON.stringify(message);
            console.log('Sending message ' + messageString );

            const kafkaMessage = {
                topic,
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