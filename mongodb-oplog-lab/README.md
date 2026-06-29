# Terminal Logs Steps:
----------------------
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker compose up -d
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/mongodb-oplog-lab/docker-compose.yml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 10/10
 ✔ mongo2 Pulled                                                                                                                         30.1s 
   ✔ 74ec64d3373f Pull complete                                                                                                           4.9s 
   ✔ 52a0c5f2e5e2 Pull complete                                                                                                           4.9s 
   ✔ 1dc502fac863 Pull complete                                                                                                           4.9s 
   ✔ 8fc4998de17a Pull complete                                                                                                           4.9s 
   ✔ a2a12e082000 Pull complete                                                                                                           4.9s 
   ✔ b03e15fb23ef Pull complete                                                                                                           8.0s 
   ✔ c40a71023d3d Pull complete                                                                                                          15.2s 
 ✔ mongo3 Pulled                                                                                                                         30.1s 
 ✔ mongo1 Pulled                                                                                                                         30.1s 
[+] Running 7/7
 ✔ Network mongodb-oplog-lab_mongo-network  Created                                                                                       0.0s 
 ✔ Volume "mongodb-oplog-lab_mongo2_data"   Created                                                                                       0.0s 
 ✔ Volume "mongodb-oplog-lab_mongo3_data"   Created                                                                                       0.0s 
 ✔ Volume "mongodb-oplog-lab_mongo1_data"   Created                                                                                       0.0s 
 ✔ Container mongo2                         Started                                                                                       0.8s 
 ✔ Container mongo3                         Started                                                                                       0.8s 
 ✔ Container mongo1                         Started                                                                                       0.8s 
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS         PORTS                                             NAMES
c625ceb7f7e6   mongo:8.0   "docker-entrypoint.s…"   10 seconds ago   Up 9 seconds   0.0.0.0:27019->27017/tcp, [::]:27019->27017/tcp   mongo3
661c80b2fc24   mongo:8.0   "docker-entrypoint.s…"   10 seconds ago   Up 9 seconds   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   mongo1
dc47af1957c0   mongo:8.0   "docker-entrypoint.s…"   10 seconds ago   Up 9 seconds   0.0.0.0:27018->27017/tcp, [::]:27018->27017/tcp   mongo2
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % 
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker exec -it mongo1 mongosh
Current Mongosh Log ID: 6a420f6acf56380fd8d1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2026-06-29T06:22:39.322+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T06:22:39.879+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T06:22:39.879+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T06:22:39.879+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T06:22:39.879+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

test> rs.initiate({
|     _id: "rs0",
|     members: [
|         {
|             _id: 0,
|             host: "mongo1:27017"
|         },
|         {
|             _id: 1,
|             host: "mongo2:27017"
|         },
|         {
|             _id: 2,
|             host: "mongo3:27017"
|         }
|     ]
| })
{
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782714235, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782714235, i: 1 })
}
rs0 [direct: secondary] test> rs.status()
{
  set: 'rs0',
  date: ISODate('2026-06-29T06:24:13.993Z'),
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
    lastCommittedOpTime: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
    lastCommittedWallTime: ISODate('2026-06-29T06:24:06.731Z'),
    readConcernMajorityOpTime: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
    appliedOpTime: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
    durableOpTime: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
    writtenOpTime: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
    lastAppliedWallTime: ISODate('2026-06-29T06:24:06.731Z'),
    lastDurableWallTime: ISODate('2026-06-29T06:24:06.731Z'),
    lastWrittenWallTime: ISODate('2026-06-29T06:24:06.731Z')
  },
  lastStableRecoveryTimestamp: Timestamp({ t: 1782714235, i: 1 }),
  electionCandidateMetrics: {
    lastElectionReason: 'electionTimeout',
    lastElectionDate: ISODate('2026-06-29T06:24:06.661Z'),
    electionTerm: Long('1'),
    lastCommittedOpTimeAtElection: { ts: Timestamp({ t: 1782714235, i: 1 }), t: Long('-1') },
    lastSeenWrittenOpTimeAtElection: { ts: Timestamp({ t: 1782714235, i: 1 }), t: Long('-1') },
    lastSeenOpTimeAtElection: { ts: Timestamp({ t: 1782714235, i: 1 }), t: Long('-1') },
    numVotesNeeded: 2,
    priorityAtElection: 1,
    electionTimeoutMillis: Long('10000'),
    numCatchUpOps: Long('0'),
    newTermStartDate: ISODate('2026-06-29T06:24:06.694Z'),
    wMajorityWriteAvailabilityDate: ISODate('2026-06-29T06:24:07.189Z')
  },
  members: [
    {
      _id: 0,
      name: 'mongo1:27017',
      health: 1,
      state: 1,
      stateStr: 'PRIMARY',
      uptime: 94,
      optime: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T06:24:06.000Z'),
      optimeWritten: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
      optimeWrittenDate: ISODate('2026-06-29T06:24:06.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      lastDurableWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      lastWrittenWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: 'Could not find member to sync from',
      electionTime: Timestamp({ t: 1782714246, i: 1 }),
      electionDate: ISODate('2026-06-29T06:24:06.000Z'),
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
      uptime: 18,
      optime: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
      optimeDurable: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
      optimeWritten: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T06:24:06.000Z'),
      optimeDurableDate: ISODate('2026-06-29T06:24:06.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T06:24:06.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      lastDurableWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      lastWrittenWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      lastHeartbeat: ISODate('2026-06-29T06:24:12.686Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T06:24:13.698Z'),
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
      uptime: 18,
      optime: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
      optimeDurable: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
      optimeWritten: { ts: Timestamp({ t: 1782714246, i: 16 }), t: Long('1') },
      optimeDate: ISODate('2026-06-29T06:24:06.000Z'),
      optimeDurableDate: ISODate('2026-06-29T06:24:06.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T06:24:06.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      lastDurableWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      lastWrittenWallTime: ISODate('2026-06-29T06:24:06.731Z'),
      lastHeartbeat: ISODate('2026-06-29T06:24:12.686Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T06:24:13.698Z'),
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
    clusterTime: Timestamp({ t: 1782714246, i: 16 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782714246, i: 16 })
}
rs0 [direct: primary] test> 
rs0 [direct: primary] test> db.hello()
{
  topologyVersion: { processId: ObjectId('6a420f2fdf6b17e39d49e530'), counter: Long('6') },
  hosts: [ 'mongo1:27017', 'mongo2:27017', 'mongo3:27017' ],
  setName: 'rs0',
  setVersion: 1,
  isWritablePrimary: true,
  secondary: false,
  primary: 'mongo1:27017',
  me: 'mongo1:27017',
  electionId: ObjectId('7fffffff0000000000000001'),
  lastWrite: {
    opTime: { ts: Timestamp({ t: 1782714266, i: 1 }), t: Long('1') },
    lastWriteDate: ISODate('2026-06-29T06:24:26.000Z'),
    majorityOpTime: { ts: Timestamp({ t: 1782714266, i: 1 }), t: Long('1') },
    majorityWriteDate: ISODate('2026-06-29T06:24:26.000Z')
  },
  maxBsonObjectSize: 16777216,
  maxMessageSizeBytes: 48000000,
  maxWriteBatchSize: 100000,
  localTime: ISODate('2026-06-29T06:24:36.450Z'),
  logicalSessionTimeoutMinutes: 30,
  connectionId: 4,
  minWireVersion: 0,
  maxWireVersion: 25,
  readOnly: false,
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782714266, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782714266, i: 1 })
}
rs0 [direct: primary] test> 
rs0 [direct: primary] test> 

rs0 [direct: primary] test> use company
switched to db company
rs0 [direct: primary] company> db.users.insertOne({
|     name: "John",
|     age: 25
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a420fd9cf56380fd8d1a7bb')
}
rs0 [direct: primary] company> db.users.insertOne({
|     name: "Alice",
|     age: 30
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a420fdecf56380fd8d1a7bc')
}
rs0 [direct: primary] company> db.users.find().pretty()
[
  { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
  { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 }
]
rs0 [direct: primary] company>
*we can't write data in secondary*:
rs0 [direct: secondary] company> db.users.insertOne({
|     name: "John",
|     age: 25
| })
MongoServerError[NotWritablePrimary]: not primary
## Why?
Because in a replica set:
✅ Only the PRIMARY accepts writes.
❌ SECONDARY never accepts writes.
*can read*:
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker exec -it mongo2 mongosh
Current Mongosh Log ID: 6a4210bee62eeabf1bd1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-29T06:22:39.323+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T06:22:39.755+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T06:22:39.755+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T06:22:39.755+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T06:22:39.755+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

rs0 [direct: secondary] test> use company
switched to db company
rs0 [direct: secondary] company> db.users.find()
[
  { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
  { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 }
]
rs0 [direct: secondary] company> 
*Oplog check*:
rs0 [direct: secondary] company> use local
switched to db local
rs0 [direct: secondary] local> show collections
oplog.rs
replset.election
replset.initialSyncId
replset.minvalid
replset.oplogTruncateAfterPoint
startup_log
system.replset
system.rollback.id
system.tenantMigration.oplogView  [view]
system.views
rs0 [direct: secondary] local> db.oplog.rs.find().pretty()
[
  {
    op: 'n',
    ns: '',
    o: { msg: 'initiating set' },
    ts: Timestamp({ t: 1782714235, i: 1 }),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:23:55.528Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('1ca064fd-150e-494a-89ce-8031003f7aab'),
    o: {
      create: 'transactions',
      idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
    },
    ts: Timestamp({ t: 1782714246, i: 2 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.684Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('1ca064fd-150e-494a-89ce-8031003f7aab'),
    o: {
      createIndexes: 'transactions',
      v: 2,
      key: { parentLsid: 1, '_id.txnNumber': 1, _id: 1 },
      name: 'parent_lsid',
      partialFilterExpression: { parentLsid: { '$exists': true } }
    },
    ts: Timestamp({ t: 1782714246, i: 3 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.685Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('0fb7b72b-bc12-4e69-8adc-f3fc4ffd7ae6'),
    o: {
      create: 'image_collection',
      idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
    },
    ts: Timestamp({ t: 1782714246, i: 4 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.694Z')
  },
  {
    op: 'n',
    ns: '',
    o: { msg: 'new primary' },
    ts: Timestamp({ t: 1782714246, i: 5 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.694Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('86819c75-9efa-4d3e-843c-61c955988166'),
    o: {
      create: 'system.indexBuilds',
      idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
    },
    ts: Timestamp({ t: 1782714246, i: 6 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.700Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('037434cf-c4d4-4703-ae5f-978627e20a99'),
    o: { create: 'system.preimages', clusteredIndex: true },
    ts: Timestamp({ t: 1782714246, i: 7 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.700Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('8c954715-06a8-4559-8623-eb3334bc3a33'),
    o: {
      create: 'analyzeShardKeySplitPoints',
      idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
    },
    ts: Timestamp({ t: 1782714246, i: 8 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.713Z')
  },
  {
    op: 'c',
    ns: 'admin.$cmd',
    ui: UUID('7d02e9bc-a58e-4c9c-9636-1a37de035d0d'),
    o: {
      create: 'system.keys',
      idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
    },
    ts: Timestamp({ t: 1782714246, i: 9 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.715Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('8c954715-06a8-4559-8623-eb3334bc3a33'),
    o: {
      createIndexes: 'analyzeShardKeySplitPoints',
      v: 2,
      key: { expireAt: 1 },
      name: 'AnalyzeShardKeySplitPointsTTLIndex',
      expireAfterSeconds: 0
    },
    ts: Timestamp({ t: 1782714246, i: 10 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.713Z')
  },
  {
    op: 'i',
    ns: 'admin.system.keys',
    ui: UUID('7d02e9bc-a58e-4c9c-9636-1a37de035d0d'),
    o: {
      _id: Long('7656699384683298821'),
      purpose: 'HMAC',
      key: Binary.createFromBase64('sCmNm1BACQw/iHbnQ8N57vl5/xM=', 0),
      expiresAt: Timestamp({ t: 1790490246, i: 0 })
    },
    o2: { _id: Long('7656699384683298821') },
    ts: Timestamp({ t: 1782714246, i: 11 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.716Z')
  },
  {
    op: 'i',
    ns: 'admin.system.keys',
    ui: UUID('7d02e9bc-a58e-4c9c-9636-1a37de035d0d'),
    o: {
      _id: Long('7656699384683298822'),
      purpose: 'HMAC',
      key: Binary.createFromBase64('blHfFp4jKy1hInA1iYt0QX6bQgQ=', 0),
      expiresAt: Timestamp({ t: 1798266246, i: 0 })
    },
    o2: { _id: Long('7656699384683298822') },
    ts: Timestamp({ t: 1782714246, i: 12 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.716Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('955accfb-7ac8-48b5-85ee-aae295deb079'),
    o: {
      create: 'sampledQueries',
      idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
    },
    ts: Timestamp({ t: 1782714246, i: 13 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.723Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('955accfb-7ac8-48b5-85ee-aae295deb079'),
    o: {
      createIndexes: 'sampledQueries',
      v: 2,
      key: { expireAt: 1 },
      name: 'SampledQueriesTTLIndex',
      expireAfterSeconds: 0
    },
    ts: Timestamp({ t: 1782714246, i: 14 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.723Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('9c618e34-8770-477e-a51a-d8818d02e206'),
    o: {
      create: 'sampledQueriesDiff',
      idIndex: { v: 2, key: { _id: 1 }, name: '_id_' }
    },
    ts: Timestamp({ t: 1782714246, i: 15 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.731Z')
  },
  {
    op: 'c',
    ns: 'config.$cmd',
    ui: UUID('9c618e34-8770-477e-a51a-d8818d02e206'),
    o: {
      createIndexes: 'sampledQueriesDiff',
      v: 2,
      key: { expireAt: 1 },
      name: 'SampledQueriesDiffTTLIndex',
      expireAfterSeconds: 0
    },
    ts: Timestamp({ t: 1782714246, i: 16 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:06.731Z')
  },
  {
    op: 'n',
    ns: '',
    o: { msg: 'periodic noop' },
    ts: Timestamp({ t: 1782714266, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:26.709Z')
  },
  {
    op: 'n',
    ns: '',
    o: { msg: 'periodic noop' },
    ts: Timestamp({ t: 1782714276, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:36.712Z')
  },
  {
    op: 'n',
    ns: '',
    o: { msg: 'periodic noop' },
    ts: Timestamp({ t: 1782714286, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:46.718Z')
  },
  {
    op: 'n',
    ns: '',
    o: { msg: 'periodic noop' },
    ts: Timestamp({ t: 1782714296, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:24:56.722Z')
  }
]
Type "it" for more
rs0 [direct: secondary] local> 

## { op: 'n', ns: '', o: { msg: 'periodic noop' }}
### What is op: 'n'?
n means No Operation (No-Op).

#### Now let's see your actual CRUD operations.
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % 
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker exec -it mongo1 mongosh
Current Mongosh Log ID: 6a421297236aa580c2d1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-29T06:22:39.322+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T06:22:39.879+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T06:22:39.879+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T06:22:39.879+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T06:22:39.879+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

rs0 [direct: primary] test> use company
switched to db company
rs0 [direct: primary] company> db.oplog.rs.find().sort({ $natural: -1 }).limit(1).pretty()

rs0 [direct: primary] company> db.users.find()
[
  { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
  { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 }
]
rs0 [direct: primary] company> use local
switched to db local
rs0 [direct: primary] local> db.oplog.rs.find().sort({ $natural: -1 }).limit(1).pretty()
[
  {
    op: 'n',
    ns: '',
    o: { msg: 'periodic noop' },
    ts: Timestamp({ t: 1782715127, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:38:47.010Z')
  }
]
rs0 [direct: primary] local> use company
switched to db company
rs0 [direct: primary] company> db.users.insertOne({
|   name: "Keerthana",
|   age: 24
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a421308236aa580c2d1a7bb')
}
rs0 [direct: primary] company> use local
switched to db local
rs0 [direct: primary] local> db.oplog.rs.find().sort({ $natural: -1 }).limit(1)
[
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: {
      _id: ObjectId('6a421308236aa580c2d1a7bb'),
      name: 'Keerthana',
      age: 24
    },
    o2: { _id: ObjectId('6a421308236aa580c2d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715144, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:39:04.391Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  }
]
rs0 [direct: primary] local> db.oplog.rs.find({
|   ns: "company.users"
| }).sort({ $natural: -1 }).limit(5).pretty()
[
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: {
      _id: ObjectId('6a421308236aa580c2d1a7bb'),
      name: 'Keerthana',
      age: 24
    },
    o2: { _id: ObjectId('6a421308236aa580c2d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715144, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:39:04.391Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('c38a1f91-e25f-4aa8-b348-9e019469ac03'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 },
    o2: { _id: ObjectId('6a420fdecf56380fd8d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782714334, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:25:34.884Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('c38a1f91-e25f-4aa8-b348-9e019469ac03'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
    o2: { _id: ObjectId('6a420fd9cf56380fd8d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782714329, i: 2 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:25:29.740Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  }
]
rs0 [direct: primary] local> 

##### Instead of:
db.oplog.rs.find().sort({ $natural: -1 }).limit(1)

run:
db.oplog.rs.find({
  ns: "company.users"
}).sort({ $natural: -1 }).limit(5).pretty()

Why?
Because:
db.oplog.rs.find().sort({ $natural: -1 })

shows everything, including:
No-op entries (op: "n")
Internal replication commands
Other system operations

Filtering by namespace:
ns: "company.users"

shows only operations on your users collection.

##### Delete the document:
rs0 [direct: primary] local> 

rs0 [direct: primary] local> use company
switched to db company
rs0 [direct: primary] company> db.users.deleteOne({
|   name: "Keerthana"
| })
{ acknowledged: true, deletedCount: 1 }
rs0 [direct: primary] company> use local
switched to db local
rs0 [direct: primary] local> db.oplog.rs.find({
|   ns: "company.users"
| }).sort({ $natural: -1 }).limit(5).pretty()
[
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'd',                                                                                                    --->*delete operation*
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a421308236aa580c2d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715474, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:44:34.973Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: {
      _id: ObjectId('6a421308236aa580c2d1a7bb'),
      name: 'Keerthana',
      age: 24
    },
    o2: { _id: ObjectId('6a421308236aa580c2d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715144, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:39:04.391Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('c38a1f91-e25f-4aa8-b348-9e019469ac03'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 },
    o2: { _id: ObjectId('6a420fdecf56380fd8d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782714334, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:25:34.884Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('c38a1f91-e25f-4aa8-b348-9e019469ac03'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
    o2: { _id: ObjectId('6a420fd9cf56380fd8d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782714329, i: 2 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:25:29.740Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  }
]
rs0 [direct: primary] local> 

###### Why are we filtering by ns?
Because the oplog records all replicated operations, including internal MongoDB events. Filtering by:
- ns: "company.users"
lets you focus only on the CRUD operations you performed, making it much easier to understand how inserts (i), updates (u), and deletes (d) are represented.

## Insert One More Document: On PRIMARY (mongo1)
1. op:
| Value | Meaning |
| ----- | ------- |
| `i`   | Insert  |
| `u`   | Update  |
| `d`   | Delete  |
| `c`   | Command |
| `n`   | No-op   |
2. ns:
Namespace.
Example: ns: "company.users" -> This operation happened on the company.users collection.
3. o:
o: {
  _id: ObjectId(...),
  name: "Bob",
  age: 28,
  city: "Hyderabad"
}
This is the actual operation payload.
4. o2:
o2: {
   _id: ObjectId(...)
}
*o contains the operation details. o2 is additional operation metadata that is especially useful for certain operation types (such as updates).*
5. ts:
This is the replication timestamp.
6. t:
t: Long("1")
t means term.
Imagine:
Primary A
↓
crashes
↓
Primary B elected
↓
Primary C elected
*Each election gets a new term.*
Means: Which Primary generated this operation?
Term = 1
meaning it was generated by the current primary in election term 1.7. 
7. v:
v: Long("2")
Oplog format version.
Mostly used internally by MongoDB.
You rarely use it directly.
8. wall:
Actual wall-clock time.
*Unlike ts, which is for replication ordering, wall is a human-readable timestamp.*
9. ui:
Every collection has a unique identifier (UUID).
10. lsid:
Logical Session ID.
11. txnNumber:
Transaction number.
Every operation in a session gets a transaction number.
12. stmtId:
Statement ID within the transaction/session.
13. prevOpTime:
Points to the previous operation in the same transaction chain.
Timestamp(0,0) -> No previous operation.

### Which fields should you focus on?
| Field  | Why it matters                           |
| ------ | ---------------------------------------- |
| `op`   | Type of operation (insert/update/delete) |
| `ns`   | Which collection was affected            |
| `o`    | The data or change being replicated      |
| `ts`   | Replication order                        |
| `wall` | Human-readable time                      |
The other fields (lsid, txnNumber, stmtId, ui, prevOpTime, v) are primarily internal metadata.

#### Update:
rs0 [direct: primary] local> use company
switched to db company
rs0 [direct: primary] company> db.users.updateOne(
|   { name: "Bob" },
|   {
|     $set: {
|       age: 35
|     }
|   }
| )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
rs0 [direct: primary] company> use local
switched to db local
rs0 [direct: primary] local> db.oplog.rs.find({
|   ns: "company.users"
| }).sort({
|   $natural: -1
| }).limit(1).pretty()
[
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('4'),
    op: 'u',                                                                                                    --->*updated*
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { '$v': 2, diff: { u: { age: 35 } } },
    o2: { _id: ObjectId('6a4214e6236aa580c2d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782716131, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:55:31.554Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  }
]
rs0 [direct: primary] local> 

#### Next Step After Checked i, d, u oplog:
rs0 [direct: primary] local> use company
switched to db company
rs0 [direct: primary] company> db.users.find().pretty()
[
  { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
  { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 },
  {
    _id: ObjectId('6a4214e6236aa580c2d1a7bc'),
    name: 'Bob',
    age: 35,
    city: 'Hyderabad'
  }
]
rs0 [direct: primary] company> 
(To exit, press Ctrl+C again or Ctrl+D or type .exit)
rs0 [direct: primary] company> 
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker stop mongo2
mongo2
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker ps
CONTAINER ID   IMAGE       COMMAND                  CREATED          STATUS          PORTS                                             NAMES
c625ceb7f7e6   mongo:8.0   "docker-entrypoint.s…"   38 minutes ago   Up 38 minutes   0.0.0.0:27019->27017/tcp, [::]:27019->27017/tcp   mongo3
661c80b2fc24   mongo:8.0   "docker-entrypoint.s…"   38 minutes ago   Up 38 minutes   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   mongo1
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab %   
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker exec -it mongo1 mongosh
Current Mongosh Log ID: 6a421859f71d77a4b0d1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-29T06:22:39.322+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T06:22:39.879+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T06:22:39.879+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T06:22:39.879+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T06:22:39.879+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

rs0 [direct: primary] test> use company
switched to db company
rs0 [direct: primary] company> db.users.insertMany([
|   {
|     name: "Tom",
|     age: 20
|   },
|   {
|     name: "Jerry",
|     age: 21
|   },
|   {
|     name: "David",
|     age: 22
|   },
|   {
|     name: "Alex",
|     age: 23
|   },
|   {
|     name: "Steve",
|     age: 24
|   }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a421866f71d77a4b0d1a7bb'),
    '1': ObjectId('6a421866f71d77a4b0d1a7bc'),
    '2': ObjectId('6a421866f71d77a4b0d1a7bd'),
    '3': ObjectId('6a421866f71d77a4b0d1a7be'),
    '4': ObjectId('6a421866f71d77a4b0d1a7bf')
  }
}
rs0 [direct: primary] company> db.users.updateOne(
|   { name: "Tom" },
|   {
|     $set: {
|       age: 30
|     }
|   }
| )
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
rs0 [direct: primary] company> db.users.deleteOne({
|   name: "Alex"
| })
{ acknowledged: true, deletedCount: 1 }
At this point:
*mongo2 doesn't know about these changes because it is stopped.*
rs0 [direct: primary] company> use local
switched to db local
rs0 [direct: primary] local> db.oplog.rs.find({
|   ns: "company.users"
| })
| .sort({ $natural: -1 })
| .limit(10)
| .pretty()
[
  {
    lsid: {
      id: UUID('8abb1f6b-f846-43d8-8707-f5f1e1f8e219'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('3'),
    op: 'd',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a421866f71d77a4b0d1a7be') },
    stmtId: 0,
    ts: Timestamp({ t: 1782716531, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T07:02:11.347Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('8abb1f6b-f846-43d8-8707-f5f1e1f8e219'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'u',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { '$v': 2, diff: { u: { age: 30 } } },
    o2: { _id: ObjectId('6a421866f71d77a4b0d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782716525, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T07:02:05.292Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('4'),
    op: 'u',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { '$v': 2, diff: { u: { age: 35 } } },
    o2: { _id: ObjectId('6a4214e6236aa580c2d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782716131, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:55:31.554Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('3'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: {
      _id: ObjectId('6a4214e6236aa580c2d1a7bc'),
      name: 'Bob',
      age: 28,
      city: 'Hyderabad'
    },
    o2: { _id: ObjectId('6a4214e6236aa580c2d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715622, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:47:02.095Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'd',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a421308236aa580c2d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715474, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:44:34.973Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: {
      _id: ObjectId('6a421308236aa580c2d1a7bb'),
      name: 'Keerthana',
      age: 24
    },
    o2: { _id: ObjectId('6a421308236aa580c2d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715144, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:39:04.391Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('c38a1f91-e25f-4aa8-b348-9e019469ac03'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 },
    o2: { _id: ObjectId('6a420fdecf56380fd8d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782714334, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:25:34.884Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('c38a1f91-e25f-4aa8-b348-9e019469ac03'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
    o2: { _id: ObjectId('6a420fd9cf56380fd8d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782714329, i: 2 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:25:29.740Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  }
]
rs0 [direct: primary] local> 
*These are the operations mongo2 missed.*

### Start secondary again:
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker start mongo2
mongo2
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker exec -it mongo2 mongosh
Current Mongosh Log ID: 6a42191a4df78aa48dd1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-29T07:04:53.089+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T07:04:54.128+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T07:04:54.129+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T07:04:54.129+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T07:04:54.129+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

rs0 [direct: secondary] test> db.hello()
{
  topologyVersion: { processId: ObjectId('6a421915434d5cb2efeaa5e4'), counter: Long('3') },
  hosts: [ 'mongo1:27017', 'mongo2:27017', 'mongo3:27017' ],
  setName: 'rs0',
  setVersion: 1,
  isWritablePrimary: false,
  secondary: true,
  primary: 'mongo1:27017',
  me: 'mongo2:27017',
  lastWrite: {
    opTime: { ts: Timestamp({ t: 1782716697, i: 1 }), t: Long('1') },
    lastWriteDate: ISODate('2026-06-29T07:04:57.000Z'),
    majorityOpTime: { ts: Timestamp({ t: 1782716697, i: 1 }), t: Long('1') },
    majorityWriteDate: ISODate('2026-06-29T07:04:57.000Z')
  },
  maxBsonObjectSize: 16777216,
  maxMessageSizeBytes: 48000000,
  maxWriteBatchSize: 100000,
  localTime: ISODate('2026-06-29T07:05:03.642Z'),
  logicalSessionTimeoutMinutes: 30,
  connectionId: 23,
  minWireVersion: 0,
  maxWireVersion: 25,
  readOnly: false,
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782716697, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782716697, i: 1 })
}
rs0 [direct: secondary] test> use company
switched to db company
rs0 [direct: secondary] company> db.users.find().pretty()
[
  { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
  { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 },
  {
    _id: ObjectId('6a4214e6236aa580c2d1a7bc'),
    name: 'Bob',
    age: 35,
    city: 'Hyderabad'
  },
  { _id: ObjectId('6a421866f71d77a4b0d1a7bd'), name: 'David', age: 22 },
  { _id: ObjectId('6a421866f71d77a4b0d1a7bf'), name: 'Steve', age: 24 },
  { _id: ObjectId('6a421866f71d77a4b0d1a7bc'), name: 'Jerry', age: 21 },
  { _id: ObjectId('6a421866f71d77a4b0d1a7bb'), name: 'Tom', age: 30 }
]
rs0 [direct: secondary] company> 
*You should not see Alex because the delete operation was also replayed.*

#### What actually happened?
While mongo2 was stopped:
PRIMARY

Insert Tom
Update Tom
Delete Alex

MongoDB wrote these operations to:
local.oplog.rs

When mongo2 restarted:
mongo2
↓
Reads oplog
↓

Replays:
Insert Tom
Update Tom
Delete Alex
↓
Now its data matches the primary
*logs*:
rs0 [direct: secondary] company> use local
rs0 [direct: secondary] local> db.oplog.rs.find({
|   ns: "company.users"
| })
| .sort({ $natural: -1 })
| .limit(10)
| .pretty()
[
  {
    lsid: {
      id: UUID('8abb1f6b-f846-43d8-8707-f5f1e1f8e219'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('3'),
    op: 'd',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a421866f71d77a4b0d1a7be') },
    stmtId: 0,
    ts: Timestamp({ t: 1782716531, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T07:02:11.347Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('8abb1f6b-f846-43d8-8707-f5f1e1f8e219'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'u',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { '$v': 2, diff: { u: { age: 30 } } },
    o2: { _id: ObjectId('6a421866f71d77a4b0d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782716525, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T07:02:05.292Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('4'),
    op: 'u',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { '$v': 2, diff: { u: { age: 35 } } },
    o2: { _id: ObjectId('6a4214e6236aa580c2d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782716131, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:55:31.554Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('3'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: {
      _id: ObjectId('6a4214e6236aa580c2d1a7bc'),
      name: 'Bob',
      age: 28,
      city: 'Hyderabad'
    },
    o2: { _id: ObjectId('6a4214e6236aa580c2d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715622, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:47:02.095Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'd',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a421308236aa580c2d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715474, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:44:34.973Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('597e98b3-92b0-4890-809b-e3a935c3ea4d'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: {
      _id: ObjectId('6a421308236aa580c2d1a7bb'),
      name: 'Keerthana',
      age: 24
    },
    o2: { _id: ObjectId('6a421308236aa580c2d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782715144, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:39:04.391Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('c38a1f91-e25f-4aa8-b348-9e019469ac03'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('2'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a420fdecf56380fd8d1a7bc'), name: 'Alice', age: 30 },
    o2: { _id: ObjectId('6a420fdecf56380fd8d1a7bc') },
    stmtId: 0,
    ts: Timestamp({ t: 1782714334, i: 1 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:25:34.884Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  },
  {
    lsid: {
      id: UUID('c38a1f91-e25f-4aa8-b348-9e019469ac03'),
      uid: Binary.createFromBase64('47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=', 0)
    },
    txnNumber: Long('1'),
    op: 'i',
    ns: 'company.users',
    ui: UUID('0061e089-6a4b-4293-b99b-22972342c133'),
    o: { _id: ObjectId('6a420fd9cf56380fd8d1a7bb'), name: 'John', age: 25 },
    o2: { _id: ObjectId('6a420fd9cf56380fd8d1a7bb') },
    stmtId: 0,
    ts: Timestamp({ t: 1782714329, i: 2 }),
    t: Long('1'),
    v: Long('2'),
    wall: ISODate('2026-06-29T06:25:29.740Z'),
    prevOpTime: { ts: Timestamp({ t: 0, i: 0 }), t: Long('-1') }
  }
]
rs0 [direct: secondary] local> 

# Oplog Size:
-------------
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker exec -it mongo1 mongosh
Current Mongosh Log ID: 6a421a9b722df3882fd1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-29T06:22:39.322+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T06:22:39.879+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T06:22:39.879+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T06:22:39.879+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T06:22:39.879+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

rs0 [direct: primary] test> use local
switched to db local
rs0 [direct: primary] local> db.oplog.rs.stats()
{
  ok: 1,
  capped: true,                                                                                                           -->*fixed maximum size*
  max: 0,
  wiredTiger: {
    metadata: { formatVersion: 1, oplogKeyExtractionVersion: 1 },
    creationString: 'access_pattern_hint=none,allocation_size=4KB,app_metadata=(formatVersion=1,oplogKeyExtractionVersion=1),assert=(commit_timestamp=none,durable_timestamp=none,read_timestamp=none,write_timestamp=off),block_allocation=best,block_compressor=snappy,cache_resident=false,checksum=on,colgroups=,collator=,columns=,dictionary=0,encryption=(keyid=,name=),exclusive=false,extractor=,format=btree,huffman_key=,huffman_value=,ignore_in_memory_cache_size=false,immutable=false,import=(compare_timestamp=oldest_timestamp,enabled=false,file_metadata=,metadata_file=,panic_corrupt=true,repair=false),internal_item_max=0,internal_key_max=0,internal_key_truncate=true,internal_page_max=4KB,key_format=q,key_gap=10,leaf_item_max=0,leaf_key_max=0,leaf_page_max=32KB,leaf_value_max=64MB,log=(enabled=true),lsm=(auto_throttle=true,bloom=true,bloom_bit_count=16,bloom_config=,bloom_hash_count=8,bloom_oldest=false,chunk_count_limit=0,chunk_max=5GB,chunk_size=10MB,merge_custom=(prefix=,start_generation=0,suffix=),merge_max=15,merge_min=0),memory_page_image_max=0,memory_page_max=10m,os_cache_dirty_max=0,os_cache_max=0,prefix_compression=false,prefix_compression_min=4,source=,split_deepen_min_child=0,split_deepen_per_child=0,split_pct=90,tiered_storage=(auth_token=,bucket=,bucket_prefix=,cache_directory=,local_retention=300,name=,object_target_size=0),type=file,value_format=u,verbose=[],write_timestamp_usage=none',
    type: 'file',
    uri: 'statistics:table:collection-14-10293509835074354530',
    LSM: {
      'bloom filter false positives': 0,
      'bloom filter hits': 0,
      'bloom filter misses': 0,
      'bloom filter pages evicted from cache': 0,
      'bloom filter pages read into cache': 0,
      'bloom filters in the LSM tree': 0,
      'chunks in the LSM tree': 0,
      'highest merge generation in the LSM tree': 0,
      'queries that could have benefited from a Bloom filter that did not exist': 0,
      'sleep for LSM checkpoint throttle': 0,
      'sleep for LSM merge throttle': 0,
      'total size of bloom filters': 0
    },
    autocommit: {
      'retries for readonly operations': 0,
      'retries for update operations': 0
    },
    backup: {
      'total modified incremental blocks with compressed data': 0,
      'total modified incremental blocks without compressed data': 0
    },
    'block-manager': {
      'allocations requiring file extension': 40,
      'blocks allocated': 192,
      'blocks freed': 47,
      'checkpoint size': 12288,
      'file allocation unit size': 4096,
      'file bytes available for reuse': 24576,
      'file magic number': 120897,
      'file major version number': 1,
      'file size in bytes': 53248,
      'minor version number': 0
    },
    btree: {
      'btree checkpoint generation': 53,
      'btree clean tree checkpoint expiration time': 0,
      'btree compact pages reviewed': 0,
      'btree compact pages rewritten': 0,
      'btree compact pages skipped': 0,
      'btree expected number of compact bytes rewritten': 0,
      'btree expected number of compact pages rewritten': 0,
      'btree number of pages reconciled during checkpoint': 96,
      'btree skipped by compaction as process would not reduce size': 0,
      'column-store fixed-size leaf pages': 0,
      'column-store fixed-size time windows': 0,
      'column-store internal pages': 0,
      'column-store variable-size RLE encoded values': 0,
      'column-store variable-size deleted values': 0,
      'column-store variable-size leaf pages': 0,
      'fixed-record size': 0,
      'maximum internal page size': 4096,
      'maximum leaf page key size': 2867,
      'maximum leaf page size': 32768,
      'maximum leaf page value size': 67108864,
      'maximum tree depth': 3,
      'number of key/value pairs': 0,
      'overflow pages': 0,
      'row-store empty values': 0,
      'row-store internal pages': 0,
      'row-store leaf pages': 0
    },
    cache: {
      'application threads eviction requested with cache fill ratio < 25%': 0,
      'application threads eviction requested with cache fill ratio >= 25% and < 50%': 0,
      'application threads eviction requested with cache fill ratio >= 50% and < 75%': 0,
      'application threads eviction requested with cache fill ratio >= 75%': 0,
      'bytes currently in the cache': 81021,
      'bytes dirty in the cache cumulative': 2074334,
      'bytes read into cache': 0,
      'bytes written from cache': 1204708,
      'checkpoint blocked page eviction': 0,
      'checkpoint of history store file blocked non-history store page eviction': 0,
      'data source pages selected for eviction unable to be evicted': 0,
      'eviction gave up due to detecting a disk value without a timestamp behind the last update on the chain': 0,
      'eviction gave up due to detecting a tombstone without a timestamp ahead of the selected on disk update': 0,
      'eviction gave up due to detecting a tombstone without a timestamp ahead of the selected on disk update after validating the update chain': 0,
      'eviction gave up due to detecting update chain entries without timestamps after the selected on disk update': 0,
      'eviction gave up due to needing to remove a record from the history store but checkpoint is running': 0,
      'eviction gave up due to no progress being made': 0,
      'eviction walk pages queued that had updates': 0,
      'eviction walk pages queued that were clean': 0,
      'eviction walk pages queued that were dirty': 0,
      'eviction walk pages seen that had updates': 0,
      'eviction walk pages seen that were clean': 0,
      'eviction walk pages seen that were dirty': 0,
      'eviction walk passes of a file': 0,
      'eviction walk target pages histogram - 0-9': 0,
      'eviction walk target pages histogram - 10-31': 0,
      'eviction walk target pages histogram - 128 and higher': 0,
      'eviction walk target pages histogram - 32-63': 0,
      'eviction walk target pages histogram - 64-128': 0,
      'eviction walk target pages reduced due to history store cache pressure': 0,
      'eviction walks abandoned': 0,
      'eviction walks gave up because they restarted their walk twice': 0,
      'eviction walks gave up because they saw too many pages and found no candidates': 0,
      'eviction walks gave up because they saw too many pages and found too few candidates': 0,
      'eviction walks random search fails to locate a page, results in a null position': 0,
      'eviction walks reached end of tree': 0,
      'eviction walks restarted': 0,
      'eviction walks started from root of tree': 0,
      'eviction walks started from saved location in tree': 0,
      'hazard pointer blocked page eviction': 0,
      'history store table insert calls': 0,
      'history store table insert calls that returned restart': 0,
      'history store table reads': 0,
      'history store table reads missed': 0,
      'history store table reads requiring squashed modifies': 0,
      'history store table resolved updates without timestamps that lose their durable timestamp': 0,
      'history store table truncation by rollback to stable to remove an unstable update': 0,
      'history store table truncation by rollback to stable to remove an update': 0,
      'history store table truncation to remove all the keys of a btree': 0,
      'history store table truncation to remove an update': 0,
      'history store table truncation to remove range of updates due to an update without a timestamp on data page': 0,
      'history store table truncation to remove range of updates due to key being removed from the data page during reconciliation': 0,
      'history store table truncations that would have happened in non-dryrun mode': 0,
      'history store table truncations to remove an unstable update that would have happened in non-dryrun mode': 0,
      'history store table truncations to remove an update that would have happened in non-dryrun mode': 0,
      'history store table updates without timestamps fixed up by reinserting with the fixed timestamp': 0,
      'history store table writes requiring squashed modifies': 0,
      'in-memory page passed criteria to be split': 0,
      'in-memory page splits': 0,
      'internal page split blocked its eviction': 0,
      'internal pages evicted': 0,
      'internal pages split during eviction': 0,
      'leaf pages split during eviction': 0,
      'locate a random in-mem ref by examining all entries on the root page': 0,
      'modified pages evicted': 0,
      'multi-block reconciliation blocked whilst checkpoint is running': 0,
      'number of times dirty trigger was reached': 0,
      'number of times eviction trigger was reached': 0,
      'number of times updates trigger was reached': 0,
      'obsolete updates removed': 0,
      'overflow keys on a multiblock row-store page blocked its eviction': 0,
      'overflow pages read into cache': 0,
      'page split during eviction deepened the tree': 0,
      'page written requiring history store records': 0,
      'pages dirtied due to obsolete time window by eviction': 0,
      'pages read into cache': 0,
      'pages read into cache after truncate': 0,
      'pages read into cache after truncate in prepare state': 0,
      'pages read into cache by checkpoint': 0,
      'pages requested from the cache': 5822,
      'pages requested from the cache due to pre-fetch': 0,
      'pages requested from the history store': 0,
      'pages seen by eviction walk': 0,
      'pages written from cache': 96,
      'pages written requiring in-memory restoration': 0,
      'recent modification of a page blocked its eviction': 0,
      'reverse splits performed': 0,
      'reverse splits skipped because of VLCS namespace gap restrictions': 0,
      'the number of saved update lists processed in __wt_hs_insert_updates': 0,
      'the number of times full update inserted to history store': 0,
      'the number of times reverse modify inserted to history store': 0,
      'the number of updates processed in __wt_hs_insert_updates': 0,
      'tracked dirty bytes in the cache': 80510,
      'tracked dirty internal page bytes in the cache': 0,
      'tracked dirty leaf page bytes in the cache': 80510,
      'uncommitted truncate blocked page eviction': 0,
      'unmodified pages evicted': 0
    },
    cache_walk: {
      'Average difference between current eviction generation when the page was last considered': 0,
      'Average on-disk page image size seen': 0,
      'Average time in cache for pages that have been visited by the eviction server': 0,
      'Average time in cache for pages that have not been visited by the eviction server': 0,
      'Clean pages currently in cache': 0,
      'Current eviction generation': 0,
      'Dirty pages currently in cache': 0,
      'Entries in the root page': 0,
      'Internal pages currently in cache': 0,
      'Leaf pages currently in cache': 0,
      'Maximum difference between current eviction generation when the page was last considered': 0,
      'Maximum page size seen': 0,
      'Minimum on-disk page image size seen': 0,
      'Number of pages never visited by eviction server': 0,
      'On-disk page image sizes smaller than a single allocation unit': 0,
      'Pages created in memory and never written': 0,
      'Pages currently queued for eviction': 0,
      'Pages that could not be queued for eviction': 0,
      'Refs skipped during cache traversal': 0,
      'Size of the root page': 0,
      'Total number of pages currently in cache': 0
    },
    checkpoint: {
      'checkpoint has acquired a snapshot for its transaction': 0,
      'transaction checkpoints due to obsolete pages': 0
    },
    'checkpoint-cleanup': {
      'pages added for eviction': 0,
      'pages dirtied due to obsolete time window': 0,
      'pages read into cache (reclaim_space)': 0,
      'pages read into cache due to obsolete time window': 0,
      'pages removed': 0,
      'pages skipped during tree walk': 0,
      'pages visited': 9
    },
    compression: {
      'compressed page maximum internal page size prior to compression': 4096,
      'compressed page maximum leaf page size prior to compression ': 131072,
      'page written to disk failed to compress': 0,
      'page written to disk was too small to compress': 50,
      'pages read from disk': 0,
      'pages read from disk with compression ratio greater than 64': 0,
      'pages read from disk with compression ratio smaller than  2': 0,
      'pages read from disk with compression ratio smaller than  4': 0,
      'pages read from disk with compression ratio smaller than  8': 0,
      'pages read from disk with compression ratio smaller than 16': 0,
      'pages read from disk with compression ratio smaller than 32': 0,
      'pages read from disk with compression ratio smaller than 64': 0,
      'pages written to disk': 46,
      'pages written to disk with compression ratio greater than 64': 0,
      'pages written to disk with compression ratio smaller than  2': 0,
      'pages written to disk with compression ratio smaller than  4': 7,
      'pages written to disk with compression ratio smaller than  8': 39,
      'pages written to disk with compression ratio smaller than 16': 0,
      'pages written to disk with compression ratio smaller than 32': 0,
      'pages written to disk with compression ratio smaller than 64': 0
    },
    cursor: {
      'Total number of deleted pages skipped during tree walk': 0,
      'Total number of entries skipped by cursor next calls': 1,
      'Total number of entries skipped by cursor prev calls': 0,
      'Total number of entries skipped to position the history store cursor': 0,
      'Total number of in-memory deleted pages skipped during tree walk': 0,
      'Total number of on-disk deleted pages skipped during tree walk': 0,
      'Total number of times a search near has exited due to prefix config': 0,
      'Total number of times cursor fails to temporarily release pinned page to encourage eviction of hot or large page': 0,
      'Total number of times cursor temporarily releases pinned page to encourage eviction of hot or large page': 0,
      'bulk loaded cursor insert calls': 0,
      'cache cursors reuse count': 2037,
      'close calls that result in cache': 2039,
      'create calls': 6,
      'cursor bound calls that return an error': 0,
      'cursor bounds cleared from reset': 293,
      'cursor bounds comparisons performed': 0,
      'cursor bounds next called on an unpositioned cursor': 4,
      'cursor bounds next early exit': 0,
      'cursor bounds prev called on an unpositioned cursor': 289,
      'cursor bounds prev early exit': 0,
      'cursor bounds search early exit': 0,
      'cursor bounds search near call repositioned cursor': 0,
      'cursor cache calls that return an error': 0,
      'cursor close calls that return an error': 0,
      'cursor compare calls that return an error': 0,
      'cursor equals calls that return an error': 0,
      'cursor get key calls that return an error': 0,
      'cursor get value calls that return an error': 0,
      'cursor insert calls that return an error': 0,
      'cursor insert check calls that return an error': 0,
      'cursor largest key calls that return an error': 0,
      'cursor modify calls that return an error': 0,
      'cursor next calls that return an error': 0,
      'cursor next calls that skip due to a globally visible history store tombstone': 0,
      'cursor next calls that skip greater than 1 and fewer than 100 entries': 1,
      'cursor next calls that skip greater than or equal to 100 entries': 0,
      'cursor next random calls that return an error': 0,
      'cursor prev calls that return an error': 0,
      'cursor prev calls that skip due to a globally visible history store tombstone': 0,
      'cursor prev calls that skip greater than or equal to 100 entries': 0,
      'cursor prev calls that skip less than 100 entries': 0,
      'cursor reconfigure calls that return an error': 0,
      'cursor remove calls that return an error': 0,
      'cursor reopen calls that return an error': 0,
      'cursor reserve calls that return an error': 0,
      'cursor reset calls that return an error': 0,
      'cursor search calls that return an error': 0,
      'cursor search near calls that return an error': 0,
      'cursor update calls that return an error': 0,
      'insert calls': 323,
      'insert key and value bytes': 46529,
      modify: 0,
      'modify key and value bytes affected': 0,
      'modify value bytes modified': 0,
      'next calls': 5828,
      'open cursor count': 3,
      'operation restarted': 0,
      'prev calls': 846,
      'remove calls': 0,
      'remove key bytes removed': 0,
      'reserve calls': 0,
      'reset calls': 7863,
      'search calls': 5172,
      'search history store calls': 0,
      'search near calls': 0,
      'truncate calls': 0,
      'update calls': 0,
      'update key and value bytes': 0,
      'update value size change': 0
    },
    reconciliation: {
      'VLCS pages explicitly reconciled as empty': 0,
      'approximate byte size of timestamps in pages written': 0,
      'approximate byte size of transaction IDs in pages written': 0,
      'cursor next/prev calls during HS wrapup search_near': 0,
      'dictionary matches': 0,
      'fast-path pages deleted': 0,
      'internal page key bytes discarded using suffix compression': 0,
      'internal page multi-block writes': 0,
      'leaf page key bytes discarded using prefix compression': 0,
      'leaf page multi-block writes': 0,
      'leaf-page overflow keys': 0,
      'maximum blocks required for a page': 1,
      'overflow values written': 0,
      'page reconciliation calls': 96,
      'page reconciliation calls for eviction': 0,
      'pages deleted': 0,
      'pages written including an aggregated newest start durable timestamp ': 11,
      'pages written including an aggregated newest stop durable timestamp ': 3,
      'pages written including an aggregated newest stop timestamp ': 0,
      'pages written including an aggregated newest stop transaction ID': 0,
      'pages written including an aggregated newest transaction ID ': 11,
      'pages written including an aggregated oldest start timestamp ': 2,
      'pages written including an aggregated prepare': 0,
      'pages written including at least one prepare': 0,
      'pages written including at least one start durable timestamp': 0,
      'pages written including at least one start timestamp': 0,
      'pages written including at least one start transaction ID': 0,
      'pages written including at least one stop durable timestamp': 0,
      'pages written including at least one stop timestamp': 0,
      'pages written including at least one stop transaction ID': 0,
      'records written including a prepare': 0,
      'records written including a start durable timestamp': 0,
      'records written including a start timestamp': 0,
      'records written including a start transaction ID': 0,
      'records written including a stop durable timestamp': 0,
      'records written including a stop timestamp': 0,
      'records written including a stop transaction ID': 0
    },
    session: { 'object compaction': 0 },
    transaction: {
      'a reader raced with a prepared transaction commit and skipped an update or updates': 0,
      'number of times overflow removed value is read': 0,
      'race to read prepared update retry': 0,
      'rollback to stable history store keys that would have been swept in non-dryrun mode': 0,
      'rollback to stable history store records with stop timestamps older than newer records': 0,
      'rollback to stable inconsistent checkpoint': 0,
      'rollback to stable keys removed': 0,
      'rollback to stable keys restored': 0,
      'rollback to stable keys that would have been removed in non-dryrun mode': 0,
      'rollback to stable keys that would have been restored in non-dryrun mode': 0,
      'rollback to stable restored tombstones from history store': 0,
      'rollback to stable restored updates from history store': 0,
      'rollback to stable skipping delete rle': 0,
      'rollback to stable skipping stable rle': 0,
      'rollback to stable sweeping history store keys': 0,
      'rollback to stable tombstones from history store that would have been restored in non-dryrun mode': 0,
      'rollback to stable updates from history store that would have been restored in non-dryrun mode': 0,
      'rollback to stable updates removed from history store': 0,
      'rollback to stable updates that would have been removed from history store in non-dryrun mode': 0,
      'update conflicts': 0
    }
  },
  sharded: false,
  size: 43622,
  count: 323,
  numOrphanDocs: 0,
  storageSize: 53248,
  totalIndexSize: 0,
  totalSize: 53248,
  indexSizes: {},
  avgObjSize: 135,
  maxSize: 22070590464,
  ns: 'local.oplog.rs',
  nindexes: 0,
  scaleFactor: 1
}
rs0 [direct: primary] local> 

## Important field -> capped: true:
1. Question: Why is the oplog a capped collection?
*Answer*:
Because:
- It has a fixed maximum size.
- When it's full, MongoDB automatically removes the oldest entries to make room for new ones.

Think of it like a circular buffer:
Oldest → Newest
A → B → C → D → E
Insert F
↓
B → C → D → E → F
MongoDB doesn't let the oplog grow forever.

# Oplog Window:
----------------
rs0 [direct: primary] local> db.getReplicationInfo()
{
  configuredLogSizeMB: 21048.1552734375,
  logSizeMB: 21048.1552734375,
  usedMB: 0.05,
  timeDiff: 3052,
  timeDiffHours: 0.85,
  tFirst: 'Mon Jun 29 2026 06:23:55 GMT+0000 (Coordinated Universal Time)',
  tLast: 'Mon Jun 29 2026 07:14:47 GMT+0000 (Coordinated Universal Time)',
  now: 'Mon Jun 29 2026 07:14:48 GMT+0000 (Coordinated Universal Time)'
}
rs0 [direct: primary] local> 
## Suppose:
timeDiffHours: 1.5
*The oplog currently contains approximately the last 1.5 hours of operations.*
This is called the oplog window.
*Oplog Window = How long operations are stored*
*Example*:
If your oplog window is 24 hours:
- Operation at 10:00 AM → Stored
- Operation at 2:00 PM → Stored  
- Operation at 10:00 AM next day → OLD entries get OVERWRITTEN
So you can only see operations from the last 24 hours
### is that i can change or set the time when for primary and secondary?
You cannot set a specific time (like "keep logs for 24 hours"). 
Instead, you set the oplog SIZE (in MB/GB), and MongoDB automatically determines the time window based on your write rate.


# Initial Sync:
----------------
* Instead of replaying operations:
Primary
↓
Copies ALL databases
↓
Copies ALL collections
↓
Copies ALL indexes
↓
Starts replication
*This is much slower than oplog replay.*

## What happens if a secondary is offline for longer than the oplog window?
For example:
Oplog Window = 1 hour

10:00  Secondary goes offline
↓
Primary keeps receiving writes
↓
12:30  Secondary comes back

The secondary asks the primary:
"Give me the operations I missed from 10:00."

The primary replies:
"I can't. Those operations were already removed from the capped oplog."
- Now the secondary cannot catch up.

*So MongoDB performs an Initial Sync.*

### Case 1: Oplog Replay (No Initial Sync)

Suppose your database contains:
Primary
|
users
------
John
Alice
Bob

Secondary has the same data:
Secondary
|
users
------
John
Alice
Bob

Now the secondary goes offline.

While it's offline, the primary executes:
db.users.insertOne({ name: "Tom" })
db.users.updateOne({ name: "John" }, { $set: { age: 26 } })
db.users.deleteOne({ name: "Alice" })

These operations are written to the oplog.

When the secondary comes back:
It says:
"I already have John, Alice, and Bob. I just need the operations I missed."

The primary replies:
"Here they are from the oplog."

The secondary replays:
Insert Tom
Update John
Delete Alice

Done. This is oplog replay.

### Case 2: Initial Sync

- Now imagine the secondary is offline for 3 days.
- The oplog only keeps 1 day of history.

When the secondary comes back, it asks:
"Give me everything I missed from 3 days ago."

The primary says:
"I can't. Those oplog entries were already overwritten."

Now ask yourself:
Can the secondary guess what changed over those 3 days?

No.

Maybe:
10 documents changed.
Maybe 10,000.
Maybe 1 million.

It has no way to know because the history is gone.

So MongoDB says:
"Don't try to repair this copy."

Instead:
Delete the old copy
        ↓
Copy the entire database again
        ↓
Copy all indexes
        ↓
Start replication again

That full copy is called Initial Sync.

#### The one sentence to remember
Oplog Replay updates an existing copy using missed operations, while Initial Sync creates a new up-to-date copy by copying the entire dataset because the required oplog history is no longer available.

##### One question for you
* Suppose:
Oplog window = 24 hours
Secondary is offline for 2 hours

Should MongoDB perform:
Oplog Replay, or
Initial Sync?
*Answer*:
Oplog Replay, Because the secondary was offline for only 2 hours, and the oplog keeps 24 hours of history. The missed operations are still present in the oplog, so the secondary can replay them and catch up.

* Scenario 2
Oplog Window = 24 hours
Secondary offline = 3 days

What happens?
Answer:
✅ Initial Sync

Why?
Because:
The secondary needs operations from 3 days ago.
The oplog only keeps the last 24 hours.
Those older operations have already been overwritten.
MongoDB cannot determine what changed.
So it copies the entire dataset again (Initial Sync), then catches up with any remaining recent oplog entries.

| Feature       | Oplog Replay                           | Initial Sync                                   |
| ------------- | -------------------------------------- | ---------------------------------------------- |
| Speed         | ✅ Fast                                 | ❌ Slow                                         |
| Copies        | Only missed operations                 | Entire database + indexes                      |
| Network usage | Low                                    | High                                           |
| Disk usage    | Low                                    | High                                           |
| When used     | Oplog still contains missed operations | Missed operations no longer exist in the oplog |

* One-line interview answer:-
Oplog Replay is fast because it replays only the missed operations, whereas Initial Sync is slow because it copies the entire dataset and indexes before catching up with recent oplog entries.

# Rollback:
---------------
We'll simulate a failover.

Primary
↓
Write A
↓
Primary crashes
↓
Secondary becomes Primary
↓
Old Primary returns
* MongoDB may need to roll back writes that never became majority committed.
* This is an advanced replication topic.

*Terminal Logs*:
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker exec -it mongo1 mongosh
Current Mongosh Log ID: 6a4237bfe9281029bdd1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-29T06:22:39.322+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T06:22:39.879+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T06:22:39.879+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T06:22:39.879+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T06:22:39.879+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

rs0 [direct: primary] test> rs.stepDown(60)
{
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782724542, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782724542, i: 1 })
}
*Primary changed to secondary after stop*
rs0 [direct: secondary] test> db.hello()
{
  topologyVersion: { processId: ObjectId('6a420f2fdf6b17e39d49e530'), counter: Long('9') },
  hosts: [ 'mongo1:27017', 'mongo2:27017', 'mongo3:27017' ],
  setName: 'rs0',
  setVersion: 1,
  isWritablePrimary: false,
  secondary: true,
  primary: 'mongo2:27017',
  me: 'mongo1:27017',
  lastWrite: {
    opTime: { ts: Timestamp({ t: 1782724575, i: 1 }), t: Long('2') },
    lastWriteDate: ISODate('2026-06-29T09:16:15.000Z'),
    majorityOpTime: { ts: Timestamp({ t: 1782724575, i: 1 }), t: Long('2') },
    majorityWriteDate: ISODate('2026-06-29T09:16:15.000Z')
  },
  maxBsonObjectSize: 16777216,
  maxMessageSizeBytes: 48000000,
  maxWriteBatchSize: 100000,
  localTime: ISODate('2026-06-29T09:16:16.875Z'),
  logicalSessionTimeoutMinutes: 30,
  connectionId: 184,
  minWireVersion: 0,
  maxWireVersion: 25,
  readOnly: false,
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782724575, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782724575, i: 1 })
}
rs0 [direct: secondary] test> use company
switched to db company
rs0 [direct: secondary] company> db.users.insertOne({
|     name: "Election Test"
| })
MongoServerError[NotWritablePrimary]: not primary                                                        -->*primary stopped so its failed*
rs0 [direct: secondary] company> use test
switched to db test
rs0 [direct: secondary] test> db.hello()
{
  topologyVersion: { processId: ObjectId('6a420f2fdf6b17e39d49e530'), counter: Long('9') },
  hosts: [ 'mongo1:27017', 'mongo2:27017', 'mongo3:27017' ],
  setName: 'rs0',
  setVersion: 1,
  isWritablePrimary: false,
  secondary: true,
  primary: 'mongo2:27017',
  me: 'mongo1:27017',
  lastWrite: {
    opTime: { ts: Timestamp({ t: 1782724675, i: 1 }), t: Long('2') },
    lastWriteDate: ISODate('2026-06-29T09:17:55.000Z'),
    majorityOpTime: { ts: Timestamp({ t: 1782724675, i: 1 }), t: Long('2') },
    majorityWriteDate: ISODate('2026-06-29T09:17:55.000Z')
  },
  maxBsonObjectSize: 16777216,
  maxMessageSizeBytes: 48000000,
  maxWriteBatchSize: 100000,
  localTime: ISODate('2026-06-29T09:18:00.267Z'),
  logicalSessionTimeoutMinutes: 30,
  connectionId: 184,
  minWireVersion: 0,
  maxWireVersion: 25,
  readOnly: false,
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782724675, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782724675, i: 1 })
}
rs0 [direct: secondary] test> 
(To exit, press Ctrl+C again or Ctrl+D or type .exit)
rs0 [direct: secondary] test> 
keerthana@Keerthanas-MacBook-Air mongodb-oplog-lab % docker exec -it mongo2 mongosh
Current Mongosh Log ID: 6a42385aec7639c134d1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.0.26
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-29T07:04:53.089+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-29T07:04:54.128+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-29T07:04:54.129+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-29T07:04:54.129+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-29T07:04:54.129+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

rs0 [direct: primary] test> use company                                                                 -->*secondary changed primary*
switched to db company
rs0 [direct: primary] company> db.users.insertOne({
|     name: "Election Test"
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a423867ec7639c134d1a7bb')
}
rs0 [direct: primary] company> use test
switched to db test
rs0 [direct: primary] test> rs.status()
{
  set: 'rs0',
  date: ISODate('2026-06-29T09:18:58.033Z'),
  myState: 1,
  term: Long('2'),
  syncSourceHost: '',
  syncSourceId: -1,
  heartbeatIntervalMillis: Long('2000'),
  majorityVoteCount: 2,
  writeMajorityCount: 2,
  votingMembersCount: 3,
  writableVotingMembersCount: 3,
  optimes: {
    lastCommittedOpTime: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
    lastCommittedWallTime: ISODate('2026-06-29T09:18:55.387Z'),
    readConcernMajorityOpTime: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
    appliedOpTime: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
    durableOpTime: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
    writtenOpTime: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
    lastAppliedWallTime: ISODate('2026-06-29T09:18:55.387Z'),
    lastDurableWallTime: ISODate('2026-06-29T09:18:55.387Z'),
    lastWrittenWallTime: ISODate('2026-06-29T09:18:55.387Z')
  },
  lastStableRecoveryTimestamp: Timestamp({ t: 1782724685, i: 1 }),
  electionCandidateMetrics: {
    lastElectionReason: 'stepUpRequestSkipDryRun',
    lastElectionDate: ISODate('2026-06-29T09:15:45.344Z'),
    electionTerm: Long('2'),
    lastCommittedOpTimeAtElection: { ts: Timestamp({ t: 1782724542, i: 1 }), t: Long('1') },
    lastSeenWrittenOpTimeAtElection: { ts: Timestamp({ t: 1782724542, i: 1 }), t: Long('1') },
    lastSeenOpTimeAtElection: { ts: Timestamp({ t: 1782724542, i: 1 }), t: Long('1') },
    numVotesNeeded: 2,
    priorityAtElection: 1,
    electionTimeoutMillis: Long('10000'),
    priorPrimaryMemberId: 0,
    numCatchUpOps: Long('0'),
    newTermStartDate: ISODate('2026-06-29T09:15:45.351Z'),
    wMajorityWriteAvailabilityDate: ISODate('2026-06-29T09:15:45.361Z')
  },
  members: [
    {
      _id: 0,
      name: 'mongo1:27017',
      health: 1,
      state: 2,
      *stateStr: 'SECONDARY',*
      uptime: 8043,
      optime: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
      optimeDurable: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
      optimeWritten: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
      optimeDate: ISODate('2026-06-29T09:18:55.000Z'),
      optimeDurableDate: ISODate('2026-06-29T09:18:55.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T09:18:55.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      lastDurableWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      lastWrittenWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      lastHeartbeat: ISODate('2026-06-29T09:18:57.693Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T09:18:57.692Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: 'mongo2:27017',
      syncSourceId: 1,
      infoMessage: '',
      configVersion: 1,
      configTerm: 2
    },
    {
      _id: 1,
      name: 'mongo2:27017',
      health: 1,
      state: 1,
      *stateStr: 'PRIMARY',*
      uptime: 8045,
      optime: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
      optimeDate: ISODate('2026-06-29T09:18:55.000Z'),
      optimeWritten: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
      optimeWrittenDate: ISODate('2026-06-29T09:18:55.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      lastDurableWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      lastWrittenWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: '',
      electionTime: Timestamp({ t: 1782724545, i: 1 }),
      electionDate: ISODate('2026-06-29T09:15:45.000Z'),
      configVersion: 1,
      configTerm: 2,
      self: true,
      lastHeartbeatMessage: ''
    },
    {
      _id: 2,
      name: 'mongo3:27017',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 8043,
      optime: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
      optimeDurable: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
      optimeWritten: { ts: Timestamp({ t: 1782724735, i: 1 }), t: Long('2') },
      optimeDate: ISODate('2026-06-29T09:18:55.000Z'),
      optimeDurableDate: ISODate('2026-06-29T09:18:55.000Z'),
      optimeWrittenDate: ISODate('2026-06-29T09:18:55.000Z'),
      lastAppliedWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      lastDurableWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      lastWrittenWallTime: ISODate('2026-06-29T09:18:55.387Z'),
      lastHeartbeat: ISODate('2026-06-29T09:18:57.692Z'),
      lastHeartbeatRecv: ISODate('2026-06-29T09:18:57.693Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: 'mongo1:27017',
      syncSourceId: 0,
      infoMessage: '',
      configVersion: 1,
      configTerm: 2
    }
  ],
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782724735, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782724735, i: 1 })
}
rs0 [direct: primary] test> 


# Change Streams:
------------------
We'll build a Node.js app:
const changeStream = collection.watch();
Then:
Insert
↓
Console logs it immediately
*You'll see that Change Streams are powered by the oplog under the hood.*
>>>>>>>>>>>>>Look at the another folder called mongodb-change-stream