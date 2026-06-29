# Terminal log:-
   2026-06-29T09:35:03.678+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

test> rs.initiate({
|   _id: "rs0",
|   members: [
|     { _id: 0, host: "localhost:27017" },
|     { _id: 1, host: "localhost:27018" },
|     { _id: 2, host: "localhost:27019" }
|   ]
| })
MongoServerError[NodeNotFound]: replSetInitiate quorum check failed because not all proposed set members responded affirmatively: localhost:27018 failed with Error connecting to localhost:27018 (127.0.0.1:27018) :: caused by :: onInvoke :: caused by :: Connection refused, localhost:27019 failed with Error connecting to localhost:27019 (127.0.0.1:27019) :: caused by :: onInvoke :: caused by :: Connection refused
test> 
(To exit, press Ctrl+C again or Ctrl+D or type .exit)
test> 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % clear
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker compose down -v
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/mongodb-change-stream/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 3/3
 ✔ Container mongo2  Removed                                                                                                              0.5s 
 ✔ Container mongo1  Removed                                                                                                              0.7s 
 ✔ Container mongo3  Removed                                                                                                              0.8s 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker compose up --build -d
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/mongodb-change-stream/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
#1 [internal] load local bake definitions
#1 reading from stdin 629B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 146B done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:22-alpine
#3 DONE 4.8s

#4 [internal] load .dockerignore
#4 transferring context: 2B done
#4 DONE 0.0s

#5 [internal] load build context
#5 transferring context: 7.49kB done
#5 DONE 0.0s

#6 [1/5] FROM docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2
#6 resolve docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 0.0s done
#6 sha256:1dd18119844762295970237ddd5b32ac891f32e68514233ae290e22faf25922b 0B / 1.26MB 0.2s
#6 sha256:4749b9b026c919018d0c11fe592b757dd1a928af6da1bfbbb19a02f445787456 0B / 443B 0.2s
#6 sha256:4749b9b026c919018d0c11fe592b757dd1a928af6da1bfbbb19a02f445787456 443B / 443B 0.3s done
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 0B / 52.67MB 0.2s
#6 sha256:5de55e5ef9c033997441461efe7ba23a986db059c0bb78b38f84ee0d72b99167 0B / 4.18MB 0.2s
#6 sha256:1dd18119844762295970237ddd5b32ac891f32e68514233ae290e22faf25922b 1.26MB / 1.26MB 0.7s done
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 3.15MB / 52.67MB 1.1s
#6 sha256:5de55e5ef9c033997441461efe7ba23a986db059c0bb78b38f84ee0d72b99167 4.18MB / 4.18MB 0.9s done
#6 extracting sha256:5de55e5ef9c033997441461efe7ba23a986db059c0bb78b38f84ee0d72b99167 0.1s done
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 6.29MB / 52.67MB 1.2s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 11.53MB / 52.67MB 1.4s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 16.78MB / 52.67MB 1.5s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 23.07MB / 52.67MB 1.7s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 28.31MB / 52.67MB 1.8s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 34.60MB / 52.67MB 2.0s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 40.89MB / 52.67MB 2.1s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 46.14MB / 52.67MB 2.3s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 51.38MB / 52.67MB 2.4s
#6 sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 52.67MB / 52.67MB 2.5s done
#6 extracting sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f
#6 extracting sha256:3a9ba6859cb186d0e1706735d48c991b4572642d864d4e9081f29c4e302ab94f 0.8s done
#6 DONE 3.3s

#6 [1/5] FROM docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2
#6 extracting sha256:1dd18119844762295970237ddd5b32ac891f32e68514233ae290e22faf25922b 0.0s done
#6 extracting sha256:4749b9b026c919018d0c11fe592b757dd1a928af6da1bfbbb19a02f445787456 done
#6 DONE 3.4s

#7 [2/5] WORKDIR /app
#7 DONE 0.1s

#8 [3/5] COPY package*.json ./
#8 DONE 0.0s

#9 [4/5] RUN npm install
#9 0.963 
#9 0.963 added 13 packages, and audited 14 packages in 744ms
#9 0.963 
#9 0.963 1 package is looking for funding
#9 0.963   run `npm fund` for details
#9 0.964 
#9 0.964 found 0 vulnerabilities
#9 0.965 npm notice
#9 0.965 npm notice New major version of npm available! 10.9.8 -> 11.17.0
#9 0.965 npm notice Changelog: https://github.com/npm/cli/releases/tag/v11.17.0
#9 0.965 npm notice To update run: npm install -g npm@11.17.0
#9 0.965 npm notice
#9 DONE 1.0s

#10 [5/5] COPY . .
#10 DONE 0.0s

#11 exporting to image
#11 exporting layers
#11 exporting layers 0.4s done
#11 exporting manifest sha256:437abdf62c19ae387595c5eb32b9cabe0395a6e26d7acc19216626ae09ba1d13 done
#11 exporting config sha256:71a36a8e4addb2c61b7c4e7236adadedd172d36695ef7968fdb67d718d0eba89 done
#11 exporting attestation manifest sha256:a393515109f538144fa4168ec6ee95839d7b60a3f928f0f915f309da5fcab2fa done
#11 exporting manifest list sha256:176bd97646871e1a21230eef242e5991279b879414bb36ef7838f6656c26e5c2 done
#11 naming to docker.io/library/mongodb-change-stream-app:latest done
#11 unpacking to docker.io/library/mongodb-change-stream-app:latest 0.1s done
#11 DONE 0.6s

#12 resolving provenance for metadata file
#12 DONE 0.0s
[+] Running 6/6
 ✔ mongodb-change-stream-app              Built                                                                                           0.0s 
 ✔ Network mongodb-change-stream_default  Created                                                                                         0.0s 
 ✔ Container mongo1                       Started                                                                                         0.5s 
 ✔ Container mongo3                       Started                                                                                         0.5s 
 ✔ Container mongo2                       Started                                                                                         0.5s 
 ✔ Container change-stream-app            Started                                                                                         0.7s 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker exec -it mongo1 mongosh
Current Mongosh Log ID: 6a423de9f7bed6d54bd1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2026-06-29T09:41:54.194+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T09:41:54.880+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T09:41:54.880+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T09:41:54.880+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T09:41:54.880+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

test> rs.initiate({
|   _id: "rs0",
|   members: [
|     { _id: 0, host: "mongo1:27017" },
|     { _id: 1, host: "mongo2:27017" },
|     { _id: 2, host: "mongo3:27017" }
|   ]
| })
{
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782726126, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782726126, i: 1 })
}
rs0 [direct: secondary] test> rs.status()
{
  set: 'rs0',
  date: ISODate('2026-06-29T09:42:36.495Z'),
  myState: 1,
  term: Long('1'),
  syncSourceHost: '',
  syncSourceId: -1,
  heartbeatIntervalMillis: Long('2000'),
  majorityVoteCount: 2,
  writeMajorityCount: 2,
  votingMembersCount: 3,
  writableVotingMembersCount: 3,
  optimes: {
    lastCommittedOpTime: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
    lastCommittedWallTime: ISODate('2026-06-29T09:42:17.348Z'),
    readConcernMajorityOpTime: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
    appliedOpTime: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
    durableOpTime: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
    writtenOpTime: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
    lastAppliedWallTime: ISODate('2026-06-29T09:42:17.348Z'),
    lastDurableWallTime: ISODate('2026-06-29T09:42:17.348Z'),
    lastWrittenWallTime: ISODate('2026-06-29T09:42:17.348Z')
  },
  lastStableRecoveryTimestamp: Timestamp({ t: 1782726126, i: 1 }),
  electionCandidateMetrics: {
    lastElectionReason: 'electionTimeout',
    lastElectionDate: ISODate('2026-06-29T09:42:17.288Z'),
    electionTerm: Long('1'),
    lastCommittedOpTimeAtElection: { ts: Timestamp({ t: 1782726126, i: 1 }), t: Long('-1') },
    lastSeenWrittenOpTimeAtElection: { ts: Timestamp({ t: 1782726126, i: 1 }), t: Long('-1') },
    lastSeenOpTimeAtElection: { ts: Timestamp({ t: 1782726126, i: 1 }), t: Long('-1') },
    numVotesNeeded: 2,
    priorityAtElection: 1,
    electionTimeoutMillis: Long('10000'),
    numCatchUpOps: Long('0'),
    newTermStartDate: ISODate('2026-06-29T09:42:17.316Z'),
    wMajorityWriteAvailabilityDate: ISODate('2026-06-29T09:42:17.806Z')
  },
  members: [
    {
      _id: 0,
      name: 'mongo1:27017',
      health: 1,
      state: 1,
      stateStr: 'PRIMARY',
      uptime: 42,
      optime: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T09:42:17.000Z'),
      optimeWritten: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
      optimeWrittenDate: ISODate('2026-06-29T09:42:17.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      lastDurableWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      lastWrittenWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: 'Could not find member to sync from',
      electionTime: Timestamp({ t: 1782726137, i: 1 }),
      electionDate: ISODate('2026-06-29T09:42:17.000Z'),
      configVersion: 1,
      configTerm: 1,
      self: true,
      lastHeartbeatMessage: ''
    },
    {
      _id: 1,
      name: 'mongo2:27017',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 30,
      optime: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
      optimeDurable: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
      optimeWritten: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T09:42:17.000Z'),
      optimeDurableDate: ISODate('2026-06-29T09:42:17.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T09:42:17.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      lastDurableWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      lastWrittenWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      lastHeartbeat: ISODate('2026-06-29T09:42:35.322Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T09:42:36.329Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: 'mongo1:27017',
      syncSourceId: 0,
      infoMessage: '',
      configVersion: 1,
      configTerm: 1
    },
    {
      _id: 2,
      name: 'mongo3:27017',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 30,
      optime: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
      optimeDurable: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
      optimeWritten: { ts: Timestamp({ t: 1782726137, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T09:42:17.000Z'),
      optimeDurableDate: ISODate('2026-06-29T09:42:17.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T09:42:17.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      lastDurableWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      lastWrittenWallTime: ISODate('2026-06-29T09:42:17.348Z'),
      lastHeartbeat: ISODate('2026-06-29T09:42:35.322Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T09:42:36.329Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: 'mongo1:27017',
      syncSourceId: 0,
      infoMessage: '',
      configVersion: 1,
      configTerm: 1
    }
  ],
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782726137, i: 16 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782726137, i: 16 })
}
rs0 [direct: primary] test> 

*Error log*:
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker inspect change-stream-app | grep MONGO_URI
                "MONGO_URI=mongodb://localhost:27017,localhost:27018,localhost:27019/company?replicaSet=rs0",
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker compose down
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/mongodb-change-stream/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 5/5
 ✔ Container change-stream-app            Removed                                                                                         0.0s 
 ✔ Container mongo2                       Removed                                                                                        10.2s 
 ✔ Container mongo3                       Removed                                                                                        10.4s 
 ✔ Container mongo1                       Removed                                                                                        10.3s 
 ✔ Network mongodb-change-stream_default  Removed                                                                                         0.2s 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker compose down --remove-orphans
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/mongodb-change-stream/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker compose up --build -d
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/mongodb-change-stream/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
#1 [internal] load local bake definitions
#1 reading from stdin 629B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 146B done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:22-alpine
#3 DONE 2.0s

#4 [internal] load .dockerignore
#4 transferring context: 2B done
#4 DONE 0.0s

#5 [1/5] FROM docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2
#5 resolve docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 0.0s done
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 43.71kB 0.0s done
#6 DONE 0.0s

#7 [3/5] COPY package*.json ./
#7 CACHED

#8 [2/5] WORKDIR /app
#8 CACHED

#9 [4/5] RUN npm install
#9 CACHED

#10 [5/5] COPY . .
#10 DONE 0.1s

#11 exporting to image
#11 exporting layers
#11 exporting layers 0.3s done
#11 exporting manifest sha256:748318e878ddbaa59a1bd9e512389cd5824872a71cf5aac98ee9a29267e5be3a 0.0s done
#11 exporting config sha256:44d265acb7b39e87f892f402ae584aefd3d36e2f7ecbe5562d5389d0e5ff70a8 done
#11 exporting attestation manifest sha256:6c4ed6c06a7bda15c4be75aadf44e41b9fc717d726eed760a63d405d86350f73 done
#11 exporting manifest list sha256:2604254c932ca474ac839aa97c29574170e9eacdd69d480e27f6d4dfee437225 done
#11 naming to docker.io/library/mongodb-change-stream-app:latest done
#11 unpacking to docker.io/library/mongodb-change-stream-app:latest 0.1s done
#11 DONE 0.4s

#12 resolving provenance for metadata file
#12 DONE 0.0s
[+] Running 6/6
 ✔ mongodb-change-stream-app              Built                                                                                           0.0s 
 ✔ Network mongodb-change-stream_default  Created                                                                                         0.0s 
 ✔ Container mongo3                       Started                                                                                         0.5s 
 ✔ Container mongo1                       Started                                                                                         0.5s 
 ✔ Container mongo2                       Started                                                                                         0.5s 
 ✔ Container change-stream-app            Started                                                                                         0.6s 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker inspect change-stream-app | grep MONGO_URI
                "MONGO_URI=mongodb://mongo1:27017,mongo2:27018,mongo3:27019/company?replicaSet=rs0",
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker logs -f change-stream-app
◇ injected env (0) from .env // tip: ◈ secrets for agents [www.dotenvx.com]
mongodb://mongo1:27017,mongo2:27018,mongo3:27019/company?replicaSet=rs0


*Connected logs*:
     at Object.onceWrapper (node:events:634:26)
      at Socket.emit (node:events:519:28)
      at emitErrorNT (node:internal/streams/destroy:170:8)
      at emitErrorCloseNT (node:internal/streams/destroy:129:3)
      at process.processTicksAndRejections (node:internal/process/task_queues:89:21) {
    errorLabelSet: Set(3) { 'SystemOverloadedError', 'RetryableError', 'ResetPool' },
    beforeHandshake: false,
    [cause]: Error: connect ECONNREFUSED 172.23.0.4:27018
        at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1638:16) {
      errno: -111,
      code: 'ECONNREFUSED',
      syscall: 'connect',
      address: '172.23.0.4',
      port: 27018
    }
  }
}

Node.js v22.23.1
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker compose down -v
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/mongodb-change-stream/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 5/5
 ✔ Container change-stream-app            Removed                                                                                         0.0s 
 ✔ Container mongo3                       Removed                                                                                         0.6s 
 ✔ Container mongo1                       Removed                                                                                         0.8s 
 ✔ Container mongo2                       Removed                                                                                         0.7s 
 ✔ Network mongodb-change-stream_default  Removed                                                                                         0.2s 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker compose up --build -d
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/mongodb-change-stream/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
#1 [internal] load local bake definitions
#1 reading from stdin 629B done
#1 DONE 0.0s

#2 [internal] load build definition from Dockerfile
#2 transferring dockerfile: 146B done
#2 DONE 0.0s

#3 [internal] load metadata for docker.io/library/node:22-alpine
#3 DONE 1.1s

#4 [internal] load .dockerignore
#4 transferring context: 2B done
#4 DONE 0.0s

#5 [1/5] FROM docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2
#5 resolve docker.io/library/node:22-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 0.0s done
#5 DONE 0.0s

#6 [internal] load build context
#6 transferring context: 42.96kB 0.0s done
#6 DONE 0.1s

#7 [2/5] WORKDIR /app
#7 CACHED

#8 [3/5] COPY package*.json ./
#8 CACHED

#9 [4/5] RUN npm install
#9 CACHED

#10 [5/5] COPY . .
#10 CACHED

#11 exporting to image
#11 exporting layers done
#11 exporting manifest sha256:748318e878ddbaa59a1bd9e512389cd5824872a71cf5aac98ee9a29267e5be3a done
#11 exporting config sha256:44d265acb7b39e87f892f402ae584aefd3d36e2f7ecbe5562d5389d0e5ff70a8 done
#11 exporting attestation manifest sha256:53a874b8137566919ffc7f221f90ce647ecf23998e10ede43267071f0d5cc170 done
#11 exporting manifest list sha256:58cc45d675a3cab73c2dc4f378551216e7e329b9258f44d6f9e63ea1c0d1cab9 done
#11 naming to docker.io/library/mongodb-change-stream-app:latest done
#11 unpacking to docker.io/library/mongodb-change-stream-app:latest done
#11 DONE 0.0s

#12 resolving provenance for metadata file
#12 DONE 0.0s
[+] Running 6/6
 ✔ mongodb-change-stream-app              Built                                                                                           0.0s 
 ✔ Network mongodb-change-stream_default  Created                                                                                         0.0s 
 ✔ Container mongo2                       Started                                                                                         0.6s 
 ✔ Container mongo1                       Started                                                                                         0.7s 
 ✔ Container mongo3                       Started                                                                                         0.7s 
 ✔ Container change-stream-app            Started                                                                                         0.8s 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker ps -a
CONTAINER ID   IMAGE                       COMMAND                  CREATED          STATUS                    PORTS                                             NAMES
0b608d9d445e   mongodb-change-stream-app   "docker-entrypoint.s…"   22 seconds ago   Up 21 seconds                                                               change-stream-app
4d8ed8773f8f   mongo:8.0                   "docker-entrypoint.s…"   22 seconds ago   Up 21 seconds             0.0.0.0:27019->27017/tcp, [::]:27019->27017/tcp   mongo3
a36867837df5   mongo:8.0                   "docker-entrypoint.s…"   22 seconds ago   Up 21 seconds             0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   mongo1
ba794574dbca   mongo:8.0                   "docker-entrypoint.s…"   22 seconds ago   Up 21 seconds             0.0.0.0:27018->27017/tcp, [::]:27018->27017/tcp   mongo2
4e6a77961c45   mongo-express               "/sbin/tini -- /dock…"   4 days ago       Exited (143) 3 days ago                                                     mongo-express
8cffffaef5f4   mongo:8                     "docker-entrypoint.s…"   4 days ago       Exited (0) 3 days ago                                                       mongodb
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker exec -it mongo1 mongosh
Current Mongosh Log ID: 6a42466364d6a60255d1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2026-06-29T10:17:40.480+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T10:17:41.403+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T10:17:41.403+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T10:17:41.403+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T10:17:41.403+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

test> rs.initiate({
|   _id: "rs0",
|   members: [
|     { _id: 0, host: "mongo1:27017" },
|     { _id: 1, host: "mongo2:27017" },
|     { _id: 2, host: "mongo3:27017" }
|   ]
| })
{
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782728297, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782728297, i: 1 })
}
rs0 [direct: secondary] test> rs.status()
{
  set: 'rs0',
  date: ISODate('2026-06-29T10:18:26.727Z'),
  myState: 2,
  term: Long('0'),
  syncSourceHost: '',
  syncSourceId: -1,
  heartbeatIntervalMillis: Long('2000'),
  majorityVoteCount: 2,
  writeMajorityCount: 2,
  votingMembersCount: 3,
  writableVotingMembersCount: 3,
  optimes: {
    lastCommittedOpTime: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    lastCommittedWallTime: ISODate('2026-06-29T10:18:17.961Z'),
    readConcernMajorityOpTime: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    appliedOpTime: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    durableOpTime: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    writtenOpTime: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    lastAppliedWallTime: ISODate('2026-06-29T10:18:17.961Z'),
    lastDurableWallTime: ISODate('2026-06-29T10:18:17.961Z'),
    lastWrittenWallTime: ISODate('2026-06-29T10:18:17.961Z')
  },
  lastStableRecoveryTimestamp: Timestamp({ t: 1782728297, i: 1 }),
  members: [
    {
      _id: 0,
      name: 'mongo1:27017',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 46,
      optime: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
      optimeDate: ISODate('2026-06-29T10:18:17.000Z'),
      optimeWritten: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
      optimeWrittenDate: ISODate('2026-06-29T10:18:17.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      lastDurableWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      lastWrittenWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: '',
      configVersion: 1,
      configTerm: 0,
      self: true,
      lastHeartbeatMessage: ''
    },
    {
      _id: 1,
      name: 'mongo2:27017',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 8,
      optime: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
      optimeDurable: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
      optimeWritten: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
      optimeDate: ISODate('2026-06-29T10:18:17.000Z'),
      optimeDurableDate: ISODate('2026-06-29T10:18:17.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T10:18:17.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      lastDurableWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      lastWrittenWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      lastHeartbeat: ISODate('2026-06-29T10:18:26.504Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T10:18:26.538Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: '',
      configVersion: 1,
      configTerm: 0
    },
    {
      _id: 2,
      name: 'mongo3:27017',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 8,
      optime: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
      optimeDurable: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
      optimeWritten: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
      optimeDate: ISODate('2026-06-29T10:18:17.000Z'),
      optimeDurableDate: ISODate('2026-06-29T10:18:17.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T10:18:17.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      lastDurableWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      lastWrittenWallTime: ISODate('2026-06-29T10:18:17.961Z'),
      lastHeartbeat: ISODate('2026-06-29T10:18:26.504Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T10:18:26.518Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: '',
      configVersion: 1,
      configTerm: 0
    }
  ],
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782728297, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782728297, i: 1 })
}
rs0 [direct: secondary] test> rs.status()
{
  set: 'rs0',
  date: ISODate('2026-06-29T10:18:40.038Z'),
  myState: 2,
  term: Long('1'),
  syncSourceHost: 'mongo3:27017',
  syncSourceId: 2,
  heartbeatIntervalMillis: Long('2000'),
  majorityVoteCount: 2,
  writeMajorityCount: 2,
  votingMembersCount: 3,
  writableVotingMembersCount: 3,
  optimes: {
    lastCommittedOpTime: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
    lastCommittedWallTime: ISODate('2026-06-29T10:18:29.289Z'),
    readConcernMajorityOpTime: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
    appliedOpTime: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
    durableOpTime: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
    writtenOpTime: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
    lastAppliedWallTime: ISODate('2026-06-29T10:18:29.289Z'),
    lastDurableWallTime: ISODate('2026-06-29T10:18:29.289Z'),
    lastWrittenWallTime: ISODate('2026-06-29T10:18:29.289Z')
  },
  lastStableRecoveryTimestamp: Timestamp({ t: 1782728297, i: 1 }),
  electionParticipantMetrics: {
    votedForCandidate: true,
    electionTerm: Long('1'),
    lastVoteDate: ISODate('2026-06-29T10:18:29.229Z'),
    electionCandidateMemberId: 2,
    voteReason: '',
    lastWrittenOpTimeAtElection: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    maxWrittenOpTimeInSet: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    lastAppliedOpTimeAtElection: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    maxAppliedOpTimeInSet: { ts: Timestamp({ t: 1782728297, i: 1 }), t: Long('-1') },
    priorityAtElection: 1,
    newTermStartDate: ISODate('2026-06-29T10:18:29.255Z'),
    newTermAppliedDate: ISODate('2026-06-29T10:18:29.773Z')
  },
  members: [
    {
      _id: 0,
      name: 'mongo1:27017',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 60,
      optime: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T10:18:29.000Z'),
      optimeWritten: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
      optimeWrittenDate: ISODate('2026-06-29T10:18:29.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      lastDurableWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      lastWrittenWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      syncSourceHost: 'mongo3:27017',
      syncSourceId: 2,
      infoMessage: '',
      configVersion: 1,
      configTerm: 1,
      self: true,
      lastHeartbeatMessage: ''
    },
    {
      _id: 1,
      name: 'mongo2:27017',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 22,
      optime: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
      optimeDurable: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
      optimeWritten: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T10:18:29.000Z'),
      optimeDurableDate: ISODate('2026-06-29T10:18:29.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T10:18:29.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      lastDurableWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      lastWrittenWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      lastHeartbeat: ISODate('2026-06-29T10:18:39.756Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T10:18:39.756Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: 'mongo3:27017',
      syncSourceId: 2,
      infoMessage: '',
      configVersion: 1,
      configTerm: 1
    },
    {
      _id: 2,
      name: 'mongo3:27017',
      health: 1,
      state: 1,
      stateStr: 'PRIMARY',
      uptime: 22,
      optime: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
      optimeDurable: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
      optimeWritten: { ts: Timestamp({ t: 1782728309, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T10:18:29.000Z'),
      optimeDurableDate: ISODate('2026-06-29T10:18:29.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T10:18:29.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      lastDurableWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      lastWrittenWallTime: ISODate('2026-06-29T10:18:29.289Z'),
      lastHeartbeat: ISODate('2026-06-29T10:18:38.257Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T10:18:39.255Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: '',
      electionTime: Timestamp({ t: 1782728309, i: 1 }),
      electionDate: ISODate('2026-06-29T10:18:29.000Z'),
      configVersion: 1,
      configTerm: 1
    }
  ],
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782728309, i: 16 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782728309, i: 16 })
}
rs0 [direct: secondary] test> use company
switched to db company
rs0 [direct: secondary] company> 
(To exit, press Ctrl+C again or Ctrl+D or type .exit)
rs0 [direct: secondary] company> 
keerthana@Keerthanas-MacBook-Air mongodb-change-stream % docker exec -it mongo3 mongosh
Current Mongosh Log ID: 6a4247df8805f7d45dd1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2026-06-29T10:17:40.494+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T10:17:41.407+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T10:17:41.407+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T10:17:41.407+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T10:17:41.407+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

rs0 [direct: primary] test> use company
switched to db company
rs0 [direct: primary] company> db.users.insertOne({
|   name: "Keerthana"
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a4247e78805f7d45dd1a7bb')
}
rs0 [direct: primary] company>

*after run docker logs -f change-stream-app this command log*:
◇ injected env (0) from .env // tip: ⌘ override existing { override: true }
mongodb://mongo1:27017,mongo2:27018,mongo3:27019/company?replicaSet=rs0
✅ Connected
👀 Listening for changes...
◇ injected env (0) from .env // tip: ⌘ multiple files { path: ['.env.local', '.env'] }
mongodb://mongo1:27017,mongo2:27018,mongo3:27019/company?replicaSet=rs0
✅ Connected
👀 Listening for changes...
--------------------------------
New Change
{
  "_id": {
    "_data": "826A4247E7000000022B042C0100296E5A10043E2953E1FDE9489DAD8881AD7EA22FB2463C6F7065726174696F6E54797065003C696E736572740046646F63756D656E744B65790046645F696400646A4247E78805F7D45DD1A7BB000004"
  },
  "operationType": "insert",
  "clusterTime": {
    "$timestamp": "7656761373946281986"
  },
  "wallTime": "2026-06-29T10:24:39.074Z",
  "fullDocument": {
    "_id": "6a4247e78805f7d45dd1a7bb",
    "name": "Keerthana"
  },
  "ns": {
    "db": "company",
    "coll": "users"
  },
  "documentKey": {
    "_id": "6a4247e78805f7d45dd1a7bb"
  }
}

## What is a Change Stream?
A Change Stream is a feature that lets your application listen to MongoDB in real time.

* Now imagine someone inserts a document.

db.users.insertOne({
   name: "Keerthana"
})

* Immediately MongoDB sends:

{
  "operationType": "insert",
  "fullDocument": {
    "name": "Keerthana"
  }
}

*Your Node application receives it instantly.*

### What operations does it detect?
It can detect almost every data-changing operation.

| MongoDB Operation  | Change Stream Event    |
| ------------------ | ---------------------- |
| insertOne()        | insert                 |
| updateOne()        | update                 |
| replaceOne()       | replace                |
| deleteOne()        | delete                 |
| findOneAndUpdate() | update                 |
| findOneAndDelete() | delete                 |
| insertMany()       | multiple insert events |

#### What is actually happening?
When you write this:
const changeStream = collection.watch();

changeStream.on("change", (change) => {
    console.log(change);
});

you are NOT reading the oplog yourself.

Your application is only saying:
*"MongoDB, notify me whenever this collection changes."*

Then MongoDB internally does this:
Insert/Update/Delete
        │
        ▼
     Oplog
        │
        ▼
MongoDB Change Stream Engine
        │
        ▼
collection.watch()
        │
        ▼
Your Node.js App

So:
Oplog = Internal MongoDB replication log.
Change Stream = MongoDB feature built on top of the oplog.
watch() = Driver API that subscribes to Change Streams.

You never query the oplog directly.

Then why do I see logs?
Because you wrote:
console.log(change);

If you remove it:                                                                                                      -->*Important point*
changeStream.on("change", (change) => {});

Nothing will be printed.

The change stream still works; you're just not displaying the events.

Instead of logging, you could do anything:
changeStream.on("change", async (change) => {
    await sendEmail();
});
|
or
|
changeStream.on("change", async (change) => {
    io.emit("new-user", change.fullDocument);
});
|
or
|
changeStream.on("change", async (change) => {
    await kafkaProducer.send(change);
});

The log is only for demonstration.

##### After Change Streams handle every type of operation.
*Logs*:
After changing index.js:
docker restart change-stream-app
Then watch the logs:
docker logs -f change-stream-app
*Terminal 1*:
✅ Connected
👀 Listening for changes...
==============================
Operation : insert
Inserted Document:
{
  _id: new ObjectId('6a42513c8805f7d45dd1a7bc'),
  name: 'John',
  age: 25
}

==============================
Operation : update
Updated Fields:
{ age: 26 }
Complete Document:
{
  _id: new ObjectId('6a42513c8805f7d45dd1a7bc'),
  name: 'John',
  age: 26
}

==============================
Operation : replace
Replaced Document:
{
  _id: new ObjectId('6a42513c8805f7d45dd1a7bc'),
  name: 'Peter',
  age: 30
}

==============================
Operation : delete
Deleted Document Id:
{ _id: new ObjectId('6a42513c8805f7d45dd1a7bc') }
*Terminal 2*:
rs0 [direct: primary] test> use company
switched to db company
rs0 [direct: primary] company> db.users.insertOne({
|   name: "Keerthana"
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a4247e78805f7d45dd1a7bb')
}
rs0 [direct: primary] company> db.users.insertOne({
|     name: "John",
|     age: 25
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a42513c8805f7d45dd1a7bc')
}
rs0 [direct: primary] company> db.users.updateOne(
|     { name: "John" },
|     {
|         $set: {
|             age: 26
|         }
|     }
| )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
rs0 [direct: primary] company> db.users.replaceOne(
|     { name: "John" },
|     {
|         name: "Peter",
|         age: 30
|     }
| )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
rs0 [direct: primary] company> db.users.deleteOne({
|     name: "Peter"
| })
{ acknowledged: true, deletedCount: 1 }
rs0 [direct: primary] company> 

