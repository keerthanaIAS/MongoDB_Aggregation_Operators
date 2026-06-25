#!/bin/bash

echo "Waiting for containers..."
sleep 10

# Init Config Server
docker exec -it $(docker ps -qf "name=configsvr1") mongosh --port 27019 --quiet --eval '
rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [{ _id: 0, host: "configsvr1:27019" }]
})
'
sleep 3

# Init Shard 1 Replica Set
docker exec -it $(docker ps -qf "name=shard1a") mongosh --port 27018 --quiet --eval '
rs.initiate({
  _id: "shard1ReplSet",
  members: [
    { _id: 0, host: "shard1a:27018" },
    { _id: 1, host: "shard1b:27018" }
  ]
})
'
sleep 3

# Init Shard 2 Replica Set
docker exec -it $(docker ps -qf "name=shard2a") mongosh --port 27018 --quiet --eval '
rs.initiate({
  _id: "shard2ReplSet",
  members: [
    { _id: 0, host: "shard2a:27018" },
    { _id: 1, host: "shard2b:27018" }
  ]
})
'
sleep 5

# Add shards to cluster
docker exec -it $(docker ps -qf "name=mongos") mongosh --quiet --eval '
sh.addShard("shard1ReplSet/shard1a:27018,shard1b:27018")
sh.addShard("shard2ReplSet/shard2a:27018,shard2b:27018")
'

echo "✅ Cluster Ready! Connect: mongosh --port 27017"