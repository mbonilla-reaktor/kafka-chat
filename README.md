# kafka-chat
Kafka Chat

### Start the project in localhost
* Set up Kafka [kafka QuickStart](https://kafka.apache.org/quickstart#quickstart_kafkastreams)
    
> start zookeper 
```bash
bin/zookeeper-server-start.sh config/zookeeper.properties
```
> start kafka server
```bash
bin/kafka-server-start.sh config/server.properties
```
> create topic 'chat-messages'
```
bin/kafka-topics.sh --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic chat-messages
```
* Run the project
```bash
npm i
npm run dev
```