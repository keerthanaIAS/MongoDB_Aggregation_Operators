## Terminal Logs:
*seeding log*:
keerthana@Keerthanas-MacBook-Air Single_Index % node seed.js
Inserted
keerthana@Keerthanas-MacBook-Air Single_Index % node server.js
Server Running
*docker log*:
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker compose up -d                          
[+] Running 3/3
 ✔ Network ecommerce-backend_default  Created                                                                                        0.0s 
 ✔ Container mongodb                  Started                                                                                        0.2s 
 ✔ Container mongo-express            Started   
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker ps
CONTAINER ID   IMAGE           COMMAND                  CREATED              STATUS              PORTS                                             NAMES
1d467aad4ef3   mongo-express   "/sbin/tini -- /dock…"   About a minute ago   Up About a minute   0.0.0.0:8081->8081/tcp, [::]:8081->8081/tcp       mongo-express
c0d078d5baca   mongo:8         "docker-entrypoint.s…"   About a minute ago   Up About a minute   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   mongodb
keerthana@Keerthanas-MacBook-Air ecommerce-backend % 



## After seed 100000 docs in DB without index 
---------------------------------------------
# terminal log:
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker exec -it mongodb mongosh
Current Mongosh Log ID: 6a3a17c0f437a123b8d1a7ba
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          8.2.11
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-23T05:15:20.500+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-23T05:15:20.743+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-23T05:15:20.743+00:00: For customers running the current memory allocator, we suggest changing the contents of the following sysfsFile
   2026-06-23T05:15:20.743+00:00: We suggest setting the contents of sysfsFile to 0.
   2026-06-23T05:15:20.743+00:00: We suggest setting swappiness to 0 or 1, as swapping can cause performance problems.
------

test> use indexpoc
switched to db indexpoc
indexpoc> db.users.find({
|     email:"user99999@gmail.com"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'user99999@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'FAA42045',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { email: { '$eq': 'user99999@gmail.com' } },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 40,
    totalKeysExamined: 0,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { email: { '$eq': 'user99999@gmail.com' } },
      nReturned: 1,
      executionTimeMillisEstimate: 37,
      works: 100001,
      advanced: 1,
      needTime: 99999,
      needYield: 0,
      saveState: 3,
      restoreState: 3,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 100000
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'user99999@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

*Interview Question:*
COLLSCAN meaning?
Mongo scans entire collection.



## After seed doc in mongodb shell with index creation Terminal log:
--------------------------------------------------------------------
indexpoc> db.users.createIndex({
|     email:1
| })
email_1
indexpoc> 

## Meaning
1 -> Ascending.
-1 -> Descending.

For equality search:
email:1
email:-1
Almost same.

## verify index terminal log from shell:
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' }
]

## Run query again:
indexpoc> db.users.find({
|     email:"user99999@gmail.com"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'user99999@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'F713C797',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ] }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 1,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'user99999@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

## IXSCAN
Means: Index Scan
Mongo directly jumps.

Index
 ↓
user99999@gmail.com
 ↓
Document

No full collection scan.

## Important Stats
1. Without index
executionStats:{
 totalDocsExamined:100000
}
2. With index
executionStats:{
 totalDocsExamined:1
}
Huge difference.


## Interview Questions
----------------------
1. Why create index?
Faster query execution.

2. Cost of index?
-Extra memory
-Extra storage
-Slower inserts
-Slower updates

3. Why inserts slower?
Mongo updates:
Document
+
Index Tree

every insert.

4. How check query using index?
Ans: .explain("executionStats")
---
COLLSCAN vs IXSCAN

COLLSCAN => Full collection search

IXSCAN => Uses index

5. Can too many indexes hurt?
Yes.

Example:
name
email
age
salary
department
city
phone

Every insert updates:
7 indexes

Write performance decreases.

## Real Benchmark Commands
db.users.find({
 email:"user99999@gmail.com"
}).explain("executionStats")

Look at:
under executionStats:
-executionTimeMillis=(1/40)
-totalDocsExamined=(1/100000)
-totalKeysExamined=(1/0)
under inputStage:
-stage=(IXSCAN/COLLSCAN)
These 4 fields are the most important for every MongoDB index interview.

| Field               | Without Index | With Index | Meaning                  |
| ------------------- | ------------- | ---------- | ------------------------ |
| executionTimeMillis | 40            | 1          | Total query time         |
| totalDocsExamined   | 100000        | 1          | Documents Mongo read     |
| totalKeysExamined   | 0             | 1          | Index entries Mongo read |                 ->beacuse there is no index that's why collscan '0'
| stage               | COLLSCAN      | IXSCAN     | How Mongo searched       |

*Why totalKeysExamined = 0 in COLLSCAN?*
Because there is no index.

Mongo does:
Collection
 ├─ Doc1
 ├─ Doc2
 ├─ Doc3
 └─ ...
It reads documents directly.

So:
totalKeysExamined: 0
*Why totalDocsExamined = 100000?*
Mongo checked every document.

*Why totalKeysExamined = 1 in IXSCAN?*
Mongo first checks index and Found immediately.
*Why totalDocsExamined = 1?*
After finding index entry, Only one document read.

## Interview Trick Question

Can this happen?
totalKeysExamined: 1
totalDocsExamined: 0

Yes. using Covered Queries during Compound Index. Mongo can answer entirely from index without touching documents.




## After created new field for compound indexing, terminal logs:
----------------------------------------------------------------
keerthana@Keerthanas-MacBook-Air Single_Index % node seed.js  
Inserted
keerthana@Keerthanas-MacBook-Air Single_Index % node server.js
Server Running
*verify index in shell after created index using mongoose*:
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' },
  { v: 2, key: { email: 1, status: 1 }, name: 'email_1_status_1' }
]
indexpoc> 

## 3 Queries:
indexpoc> db.users.find({
|     email: "user99999@gmail.com"
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'user99999@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'A3EDD7E3',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ] }
      }
    },
    rejectedPlans: [
      {
        isCached: false,
        stage: 'FETCH',
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: { email: 1, status: 1 },
          indexName: 'email_1_status_1',
          isMultiKey: false,
          multiKeyPaths: { email: [], status: [] },
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: {
            email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ],
            status: [ '[MinKey, MaxKey]' ]
          }
        }
      }
    ]
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 1,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 3,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'user99999@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
Expected Result: "stage": "IXSCAN" ✅
indexpoc> db.users.find({
|     email: "user99999@gmail.com",
|     status: "active"
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {
      '$and': [
        { email: { '$eq': 'user99999@gmail.com' } },
        { status: { '$eq': 'active' } }
      ]
    },
    indexFilterSet: false,
    queryHash: '898694C1',
    planCacheShapeHash: '898694C1',
    planCacheKey: '3536C228',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ],
          status: [ '["active", "active"]' ]
        }
      }
    },
    rejectedPlans: [
      {
        isCached: false,
        stage: 'FETCH',
        filter: { status: { '$eq': 'active' } },
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: { email: 1 },
          indexName: 'email_1',
          isMultiKey: false,
          multiKeyPaths: { email: [] },
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: {
            email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ]
          }
        }
      }
    ]
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 0,
    executionTimeMillis: 0,
    totalKeysExamined: 0,
    totalDocsExamined: 0,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 0,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 0,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 0,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 0,
        executionTimeMillisEstimate: 0,
        works: 1,
        advanced: 0,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ],
          status: [ '["active", "active"]' ]
        },
        keysExamined: 0,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BB12058DBB1D2E0850DC51BCEB6776CEA48C57A2B0D7F53FCAFB538C3C95770C',
  command: {
    find: 'users',
    filter: { email: 'user99999@gmail.com', status: 'active' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
Expected Result: "stage": "IXSCAN" ✅ (Uses index on email)
indexpoc> db.users.find({
|     status: "active"
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { status: { '$eq': 'active' } },
    indexFilterSet: false,
    queryHash: 'F7CB0027',
    planCacheShapeHash: 'F7CB0027',
    planCacheKey: 'F1FC435E',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { status: { '$eq': 'active' } },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 50000,
    executionTimeMillis: 45,
    totalKeysExamined: 0,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { status: { '$eq': 'active' } },
      nReturned: 50000,
      executionTimeMillisEstimate: 22,
      works: 100001,
      advanced: 50000,
      needTime: 50000,
      needYield: 0,
      saveState: 3,
      restoreState: 3,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 100000
    }
  },
  queryShapeHash: 'B2BD7FDEA558DB8BD208294544883FA80D3B286EA0F4AA54ACD37DD2BCEE4439',
  command: { find: 'users', filter: { status: 'active' }, '$db': 'indexpoc' },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
Expected Result: "stage": "COLLSCAN" ❌ (No index on status)
*Why Query 3 Doesn't Use Index?*
Your index is on email, but you're querying on status. MongoDB can only use the index if the query includes the first field(s) of the index. 
Index: { email: 1 }
        ↑
        |
Queries that use it:
✅ { email: "..." }           - Includes email (first field)
✅ { email: "...", status: "..." } - Includes email (first field)

Queries that DON'T use it:
❌ { status: "..." }          - Missing email (first field)
❌ { status: "...", email: "..." } - Still uses email if included

## What is the Left Prefix Rule?
The Left Prefix Rule states that MongoDB can only use an index if the query includes the leftmost (first) field(s) of that index.

Think of it like a phone book:
Phone Book Index: [LastName, FirstName]
                     ↑
                     |
          Must start with this!

✅ Can find: "Smith, John"     - Has LastName
✅ Can find: "Smith"           - Has LastName
❌ Cannot find: "John"         - Missing LastName!



## After seed Multikey index, Terminal logs:
---------------------------------------------
keerthana@Keerthanas-MacBook-Air Single_Index % node seed.js  
Inserted
keerthana@Keerthanas-MacBook-Air Single_Index % node server.js
Server Running
*shell logs*:
indexpoc> db.users.createIndex({ skills: 1 })
skills_1
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' },
  { v: 2, key: { email: 1, status: 1 }, name: 'email_1_status_1' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' }
]
indexpoc> 
indexpoc> db.users.find({
|    skills:"React"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { skills: { '$eq': 'React' } },
    indexFilterSet: false,
    queryHash: 'CF652545',
    planCacheShapeHash: 'CF652545',
    planCacheKey: '811F0374',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { skills: 1 },
        indexName: 'skills_1',
        isMultiKey: true,
        multiKeyPaths: { skills: [ 'skills' ] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { skills: [ '["React", "React"]' ] }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 100000,
    executionTimeMillis: 113,
    totalKeysExamined: 100000,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 100000,
      executionTimeMillisEstimate: 98,
      works: 100001,
      advanced: 100000,
      needTime: 0,
      needYield: 0,
      saveState: 7,
      restoreState: 7,
      isEOF: 1,
      docsExamined: 100000,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 100000,
        executionTimeMillisEstimate: 39,
        works: 100001,
        advanced: 100000,
        needTime: 0,
        needYield: 0,
        saveState: 7,
        restoreState: 7,
        isEOF: 1,
        keyPattern: { skills: 1 },
        indexName: 'skills_1',
        isMultiKey: true,
        multiKeyPaths: { skills: [ 'skills' ] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { skills: [ '["React", "React"]' ] },
        keysExamined: 100000,
        seeks: 1,
        dupsTested: 100000,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '1E785D0E72709B58F0E4BC40590A9FCD94C7D6FCBCCFBCEBB95C35665703FF6C',
  command: { find: 'users', filter: { skills: 'React' }, '$db': 'indexpoc' },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
Look for: stage:"IXSCAN"  ✅ 

## Interview Question
Document:
{
 skills:[
   "Node",
   "React",
   "MongoDB"
 ]
}

How many index entries?
Answer: 3

One for each array element.

Limitation:
Bad:

{
 tags:["a","b"],
 skills:["x","y"]
}
Compound Index:
{
 tags:1,
 skills:1
}
Mongo rejects.

Reason:
*Both fields are arrays.* Would create massive combinations.
Interviewers love this question.



## Covered Index Query:
-----------------------
*What is a Covered Query?*
A Covered Query is when all the fields requested in the query are present in the index, 
so MongoDB doesn't need to fetch the actual documents - it can return results directly from the index!
Without Covered Query:  Index → Fetch Document → Return
With Covered Query:     Index → Return (No document fetch!) 🚀
*Terminal Logs*:
indexpoc> db.users.find(
|  {
|    email:"user1@gmail.com"
|  },
|  {
|    email:1,
|    status:1,
|    _id:0
|  }
| )
[ { email: 'user1@gmail.com', status: 'inactive' } ]
indexpoc> 
indexpoc> db.users.find(
|     { email: "user1@gmail.com" },  // Query filter
|     { email: 1, status: 1, _id: 0 } // Projection - only index fields
| ).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'user1@gmail.com' } },
    indexFilterSet: false,
    queryHash: '26EE5E05',
    planCacheShapeHash: '26EE5E05',
    planCacheKey: 'D2280350',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'PROJECTION_COVERED',
      transformBy: { email: 1, status: 1, _id: 0 },
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '["user1@gmail.com", "user1@gmail.com"]' ],
          status: [ '[MinKey, MaxKey]' ]
        }
      }
    },
    rejectedPlans: [
      {
        isCached: false,
        stage: 'PROJECTION_SIMPLE',
        transformBy: { email: 1, status: 1, _id: 0 },
        inputStage: {
          stage: 'FETCH',
          inputStage: {
            stage: 'IXSCAN',
            keyPattern: { email: 1 },
            indexName: 'email_1',
            isMultiKey: false,
            multiKeyPaths: { email: [] },
            isUnique: false,
            isSparse: false,
            isPartial: false,
            indexVersion: 2,
            direction: 'forward',
            indexBounds: { email: [ '["user1@gmail.com", "user1@gmail.com"]' ] }
          }
        }
      }
    ]
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 0,
    totalKeysExamined: 1,
    totalDocsExamined: 0,                                                             // ← *KEY: No documents fetched!*
    executionStages: {
      isCached: false,
      stage: 'PROJECTION_COVERED',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 3,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      transformBy: { email: 1, status: 1, _id: 0 },
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 3,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '["user1@gmail.com", "user1@gmail.com"]' ],
          status: [ '[MinKey, MaxKey]' ]
        },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '129D9E93B629BC8A42EA34E7A4D9EFB06B5424DEF66F429CED5010C2AA1DF88B',
  command: {
    find: 'users',
    filter: { email: 'user1@gmail.com' },
    projection: { email: 1, status: 1, _id: 0 },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
*not in index*
indexpoc> db.users.find(
|     { email: "user1@gmail.com" },  // Query filter
|     { email: 1, status: 1, name: 1, _id: 0 } // 'name' NOT in index!
| ).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'user1@gmail.com' } },
    indexFilterSet: false,
    queryHash: '4A664A30',
    planCacheShapeHash: '4A664A30',
    planCacheKey: 'A09B310E',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'PROJECTION_SIMPLE',
      transformBy: { email: 1, status: 1, name: 1, _id: 0 },
      inputStage: {
        stage: 'FETCH',
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: { email: 1 },
          indexName: 'email_1',
          isMultiKey: false,
          multiKeyPaths: { email: [] },
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: { email: [ '["user1@gmail.com", "user1@gmail.com"]' ] }
        }
      }
    },
    rejectedPlans: [
      {
        isCached: false,
        stage: 'PROJECTION_SIMPLE',
        transformBy: { email: 1, status: 1, name: 1, _id: 0 },
        inputStage: {
          stage: 'FETCH',
          inputStage: {
            stage: 'IXSCAN',
            keyPattern: { email: 1, status: 1 },
            indexName: 'email_1_status_1',
            isMultiKey: false,
            multiKeyPaths: { email: [], status: [] },
            isUnique: false,
            isSparse: false,
            isPartial: false,
            indexVersion: 2,
            direction: 'forward',
            indexBounds: {
              email: [ '["user1@gmail.com", "user1@gmail.com"]' ],
              status: [ '[MinKey, MaxKey]' ]
            }
          }
        }
      }
    ]
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 0,
    totalKeysExamined: 1,
    totalDocsExamined: 1,                                                                    // ← *Fetched document for 'name'!*
    executionStages: {
      isCached: false,
      stage: 'PROJECTION_SIMPLE',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 3,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      transformBy: { email: 1, status: 1, name: 1, _id: 0 },
      inputStage: {
        stage: 'FETCH',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 3,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        docsExamined: 1,
        alreadyHasObj: 0,
        inputStage: {
          stage: 'IXSCAN',
          nReturned: 1,
          executionTimeMillisEstimate: 0,
          works: 2,
          advanced: 1,
          needTime: 0,
          needYield: 0,
          saveState: 0,
          restoreState: 0,
          isEOF: 1,
          keyPattern: { email: 1 },
          indexName: 'email_1',
          isMultiKey: false,
          multiKeyPaths: { email: [] },
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: { email: [ '["user1@gmail.com", "user1@gmail.com"]' ] },
          keysExamined: 1,
          seeks: 1,
          dupsTested: 0,
          dupsDropped: 0
        }
      }
    }
  },
  queryShapeHash: '7B68C7BC797A0D99C9E2048124E45CA6D4A252140926F5D953E5780EF1DBBA6D',
  command: {
    find: 'users',
    filter: { email: 'user1@gmail.com' },
    projection: { email: 1, status: 1, name: 1, _id: 0 },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 



## Sort Optimization MongoDB uses indexes for sorting
-----------------------------------------------------
*What is Sort Optimization?*
When you sort by fields that match an index, 
MongoDB can return results already in sorted order directly from the index, without needing to sort in memory.
Without Index:  Find → Sort in Memory (RAM) → Return
With Index:     Index (already sorted) → Return 🚀
*Terminal logs*:
indexpoc> db.users.find()
|     .sort({ email: 1, status: 1 })
|     .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {},
    indexFilterSet: false,
    queryHash: '0D0F6DC0',
    planCacheShapeHash: '0D0F6DC0',
    planCacheKey: 'B57E1B58',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '[MinKey, MaxKey]' ],
          status: [ '[MinKey, MaxKey]' ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 100000,
    executionTimeMillis: 115,
    totalKeysExamined: 100000,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 100000,
      executionTimeMillisEstimate: 98,
      works: 100001,
      advanced: 100000,
      needTime: 0,
      needYield: 0,
      saveState: 7,
      restoreState: 7,
      isEOF: 1,
      docsExamined: 100000,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 100000,
        executionTimeMillisEstimate: 40,
        works: 100001,
        advanced: 100000,
        needTime: 0,
        needYield: 0,
        saveState: 7,
        restoreState: 7,
        isEOF: 1,
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '[MinKey, MaxKey]' ],
          status: [ '[MinKey, MaxKey]' ]
        },
        keysExamined: 100000,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'A55E680DCF602CA15D55F3D6704162014B99CA5550FC88C59766F203ED5DCFB6',
  command: {
    find: 'users',
    filter: {},
    sort: { email: 1, status: 1 },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 
*Why No sortStage in Your Output*: The absence of a sortStage means MongoDB is using the index for sorting - this is exactly what we want! 🎉

## how to test and see the SORT stage with COLLSCAN in your MongoDB shell:
--------------------------------------------------------------------------
*Terminal log after dropindex and check sort*:
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' },
  { v: 2, key: { email: 1, status: 1 }, name: 'email_1_status_1' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' }
]
indexpoc> db.users.dropIndex("email_1_status_1")
{ nIndexesWas: 4, ok: 1 }
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' }
]
indexpoc> db.users.find()
|     .sort({ status: 1 })
|     .limit(10)
|     .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {},
    indexFilterSet: false,
    queryHash: 'CB1C03F1',
    planCacheShapeHash: 'CB1C03F1',
    planCacheKey: '8CEB3E73',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'SORT',                                                                          // ← *In-memory sorting!*
      sortPattern: { status: 1 },
      memLimit: 104857600,
      limitAmount: 10,
      type: 'simple',
      inputStage: { stage: 'COLLSCAN', direction: 'forward' }                                 // ← *No index used*
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 10,
    executionTimeMillis: 41,
    totalKeysExamined: 0,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'SORT',
      nReturned: 10,
      executionTimeMillisEstimate: 22,
      works: 100012,
      advanced: 10,
      needTime: 100001,
      needYield: 0,
      saveState: 2,
      restoreState: 2,
      isEOF: 1,
      sortPattern: { status: 1 },
      memLimit: 104857600,
      limitAmount: 10,
      type: 'simple',
      totalDataSizeSorted: 1880,
      usedDisk: false,
      spills: 0,
      spilledRecords: 0,
      spilledBytes: 0,
      spilledDataStorageSize: 0,
      inputStage: {
        stage: 'COLLSCAN',
        nReturned: 100000,
        executionTimeMillisEstimate: 16,
        works: 100001,
        advanced: 100000,
        needTime: 0,
        needYield: 0,
        saveState: 2,
        restoreState: 2,
        isEOF: 1,
        direction: 'forward',
        docsExamined: 100000
      }
    }
  },
  queryShapeHash: '100C6B2FC56B6A90A9CAF8ADCDCF11FF7AB689BD4FFA7161DA3CBCECA7555CB6',
  command: {
    find: 'users',
    filter: {},
    sort: { status: 1 },
    limit: 10,
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

*index created again*:
indexpoc> db.users.createIndex({ status: 1 })
status_1
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' },
  { v: 2, key: { status: 1 }, name: 'status_1' }
]
indexpoc> 

## **Index Sort vs In-Memory Sort: Quick Comparison**

| Feature                | **Index Sort** ✅            | **In-Memory Sort** ❌ 
|---------               |------------------            |-----------------------
| **How it works**       | Uses pre-sorted index        | Sorts all documents in RAM 
| **Stage in explain**   | `IXSCAN`                     | `SORT` 
| **Memory usage**       | Minimal (just index)         | High (entire dataset)
| **Speed**              | 🚀 Very Fast                 |🐢 Slow 
| **Limit**              | No limit                     | 32MB memory limit 
| **Docs scanned**       | Only returned docs           | ALL documents 
| **When used**          | Sort matches index fields    | No matching index

### **Example in MongoDB Shell:**
```javascript
// ✅ INDEX SORT (Fast)
db.users.find().sort({ email: 1 }).explain("executionStats")
// Stage: IXSCAN

// ❌ IN-MEMORY SORT (Slow)
db.users.find().sort({ age: 1 }).explain("executionStats")
// Stage: SORT ← Sorting in RAM!
```

### **In Simple Terms:**
- **Index Sort** = Using a phonebook (already sorted alphabetically)
- **In-Memory Sort** = Writing all names on paper, then sorting them yourself

### **Key Rule:**
> **If sort fields match index fields → Index Sort (Fast)**
> **If sort fields don't match index → In-Memory Sort (Slow)**

*You summarized it perfectly:* Creating an index keeps data pre-sorted → FAST. No index = collect all docs → sort manually → SLOW.



## Text Index + Sparse Index + Partial Index:
----------------------------------------------
| Index         | Purpose                                   |
| ------------- | ----------------------------------------- |
| Text Index    | Search words/sentences                    |
| Sparse Index  | Index only documents where field exists   |
| Partial Index | Index only documents matching a condition |

*Without Text Index:* COLLSCAN, Slow, Regex scan

## Text Index - Complete Shell Steps:
*After added new Text index field*:
keerthana@Keerthanas-MacBook-Air Single_Index % node seed.js  
Inserted
keerthana@Keerthanas-MacBook-Air Single_Index % node server.js
Server Running
*Terminal logs*:
indexpoc> db.users.createIndex({ bio: "text" })
bio_text
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' },
  { v: 2, key: { status: 1 }, name: 'status_1' },
  {
    v: 2,
    key: { _fts: 'text', _ftsx: 1 },
    name: 'bio_text',
    weights: { bio: 1 },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: 3
  }
]
indexpoc> 
indexpoc> db.users.find()
|     .sort({ status: 1 })
|     .limit(10)
|     .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {},
    indexFilterSet: false,
    queryHash: 'CB1C03F1',
    planCacheShapeHash: 'CB1C03F1',
    planCacheKey: '8CEB3E73',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'SORT',
      sortPattern: { status: 1 },
      memLimit: 104857600,
      limitAmount: 10,
      type: 'simple',
      inputStage: { stage: 'COLLSCAN', direction: 'forward' }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 10,
    executionTimeMillis: 41,
    totalKeysExamined: 0,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'SORT',
      nReturned: 10,
      executionTimeMillisEstimate: 22,
      works: 100012,
      advanced: 10,
      needTime: 100001,
      needYield: 0,
      saveState: 2,
      restoreState: 2,
      isEOF: 1,
      sortPattern: { status: 1 },
      memLimit: 104857600,
      limitAmount: 10,
      type: 'simple',
      totalDataSizeSorted: 1880,
      usedDisk: false,
      spills: 0,
      spilledRecords: 0,
      spilledBytes: 0,
      spilledDataStorageSize: 0,
      inputStage: {
        stage: 'COLLSCAN',
        nReturned: 100000,
        executionTimeMillisEstimate: 16,
        works: 100001,
        advanced: 100000,
        needTime: 0,
        needYield: 0,
        saveState: 2,
        restoreState: 2,
        isEOF: 1,
        direction: 'forward',
        docsExamined: 100000
      }
    }
  },
  queryShapeHash: '100C6B2FC56B6A90A9CAF8ADCDCF11FF7AB689BD4FFA7161DA3CBCECA7555CB6',
  command: {
    find: 'users',
    filter: {},
    sort: { status: 1 },
    limit: 10,
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> db.users.createIndex({ status: 1 })
status_1
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' },
  { v: 2, key: { status: 1 }, name: 'status_1' }
]
indexpoc> 

indexpoc> 

indexpoc> 

indexpoc> 

indexpoc> 

indexpoc> 

indexpoc> 

indexpoc> db.users.createIndex({ bio: "text" })
bio_text
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' },
  { v: 2, key: { status: 1 }, name: 'status_1' },
  {
    v: 2,
    key: { _fts: 'text', _ftsx: 1 },
    name: 'bio_text',
    weights: { bio: 1 },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: 3
  }
]
## 1. Basic Text Search
indexpoc> db.users.find({
|     $text: {
|         $search: "developer"
|     }
| }).pretty()
[
  {
    _id: ObjectId('6a3a2bdab3bac003556141f3'),
    name: 'User99999',
    email: 'user99999@gmail.com',
    age: 22,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99999',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f2'),
    name: 'User99998',
    email: 'user99998@gmail.com',
    age: 40,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99998',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f1'),
    name: 'User99997',
    email: 'user99997@gmail.com',
    age: 18,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99997',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f0'),
    name: 'User99996',
    email: 'user99996@gmail.com',
    age: 57,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99996',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ef'),
    name: 'User99995',
    email: 'user99995@gmail.com',
    age: 35,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99995',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ee'),
    name: 'User99994',
    email: 'user99994@gmail.com',
    age: 34,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99994',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ed'),
    name: 'User99993',
    email: 'user99993@gmail.com',
    age: 1,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99993',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ec'),
    name: 'User99992',
    email: 'user99992@gmail.com',
    age: 31,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99992',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141eb'),
    name: 'User99991',
    email: 'user99991@gmail.com',
    age: 30,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99991',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ea'),
    name: 'User99990',
    email: 'user99990@gmail.com',
    age: 59,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99990',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e9'),
    name: 'User99989',
    email: 'user99989@gmail.com',
    age: 39,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99989',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e8'),
    name: 'User99988',
    email: 'user99988@gmail.com',
    age: 55,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99988',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e7'),
    name: 'User99987',
    email: 'user99987@gmail.com',
    age: 23,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99987',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e6'),
    name: 'User99986',
    email: 'user99986@gmail.com',
    age: 42,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99986',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e5'),
    name: 'User99985',
    email: 'user99985@gmail.com',
    age: 24,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99985',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e4'),
    name: 'User99984',
    email: 'user99984@gmail.com',
    age: 59,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99984',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e3'),
    name: 'User99983',
    email: 'user99983@gmail.com',
    age: 40,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99983',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e2'),
    name: 'User99982',
    email: 'user99982@gmail.com',
    age: 29,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99982',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e1'),
    name: 'User99981',
    email: 'user99981@gmail.com',
    age: 47,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99981',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e0'),
    name: 'User99980',
    email: 'user99980@gmail.com',
    age: 57,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99980',
    __v: 0
  }
]
Type "it" for more
indexpoc> 

## 2. Search with Multiple Words
indexpoc> db.users.find({
|     $text: {
|         $search: "mern developer"
|     }
| }).pretty()
[
  {
    _id: ObjectId('6a3a2bdab3bac003556141f3'),
    name: 'User99999',
    email: 'user99999@gmail.com',
    age: 22,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99999',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f2'),
    name: 'User99998',
    email: 'user99998@gmail.com',
    age: 40,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99998',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f1'),
    name: 'User99997',
    email: 'user99997@gmail.com',
    age: 18,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99997',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f0'),
    name: 'User99996',
    email: 'user99996@gmail.com',
    age: 57,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99996',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ef'),
    name: 'User99995',
    email: 'user99995@gmail.com',
    age: 35,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99995',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ee'),
    name: 'User99994',
    email: 'user99994@gmail.com',
    age: 34,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99994',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ed'),
    name: 'User99993',
    email: 'user99993@gmail.com',
    age: 1,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99993',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ec'),
    name: 'User99992',
    email: 'user99992@gmail.com',
    age: 31,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99992',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141eb'),
    name: 'User99991',
    email: 'user99991@gmail.com',
    age: 30,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99991',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ea'),
    name: 'User99990',
    email: 'user99990@gmail.com',
    age: 59,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99990',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e9'),
    name: 'User99989',
    email: 'user99989@gmail.com',
    age: 39,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99989',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e8'),
    name: 'User99988',
    email: 'user99988@gmail.com',
    age: 55,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99988',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e7'),
    name: 'User99987',
    email: 'user99987@gmail.com',
    age: 23,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99987',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e6'),
    name: 'User99986',
    email: 'user99986@gmail.com',
    age: 42,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99986',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e5'),
    name: 'User99985',
    email: 'user99985@gmail.com',
    age: 24,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99985',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e4'),
    name: 'User99984',
    email: 'user99984@gmail.com',
    age: 59,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99984',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e3'),
    name: 'User99983',
    email: 'user99983@gmail.com',
    age: 40,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99983',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e2'),
    name: 'User99982',
    email: 'user99982@gmail.com',
    age: 29,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99982',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e1'),
    name: 'User99981',
    email: 'user99981@gmail.com',
    age: 47,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99981',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e0'),
    name: 'User99980',
    email: 'user99980@gmail.com',
    age: 57,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99980',
    __v: 0
  }
]
Type "it" for more
indexpoc> 

## 3. Search with Score (Relevance)
indexpoc> db.users.find(
|     {
|         $text: {
|             $search: "developer"
|         }
|     },
|     {
|         score: {
|             $meta: "textScore"
|         }
|     }
| ).pretty()
[
  {
    _id: ObjectId('6a3a2bdab3bac003556128bf'),
    name: 'User93547',
    email: 'user93547@gmail.com',
    age: 21,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 93547',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac0035560fcee'),
    name: 'User82330',
    email: 'user82330@gmail.com',
    age: 49,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 82330',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac00355606a72'),
    name: 'User44830',
    email: 'user44830@gmail.com',
    age: 34,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 44830',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac00355603912'),
    name: 'User32190',
    email: 'user32190@gmail.com',
    age: 38,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 32190',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac00355601e81'),
    name: 'User25389',
    email: 'user25389@gmail.com',
    age: 26,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 25389',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003556081d4'),
    name: 'User50816',
    email: 'user50816@gmail.com',
    age: 47,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 50816',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555ff4e8'),
    name: 'User14740',
    email: 'user14740@gmail.com',
    age: 50,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 14740',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac00355610848'),
    name: 'User85236',
    email: 'user85236@gmail.com',
    age: 46,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 85236',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555fca65'),
    name: 'User3857',
    email: 'user3857@gmail.com',
    age: 34,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 3857',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555fe5bf'),
    name: 'User10859',
    email: 'user10859@gmail.com',
    age: 0,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 10859',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac00355613bae'),
    name: 'User98394',
    email: 'user98394@gmail.com',
    age: 20,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 98394',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac0035560011a'),
    name: 'User17862',
    email: 'user17862@gmail.com',
    age: 20,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 17862',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac00355602f6e'),
    name: 'User29722',
    email: 'user29722@gmail.com',
    age: 27,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 29722',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac0035560cb02'),
    name: 'User69550',
    email: 'user69550@gmail.com',
    age: 21,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 69550',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac0035560abb8'),
    name: 'User61540',
    email: 'user61540@gmail.com',
    age: 50,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 61540',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555ffc86'),
    name: 'User16690',
    email: 'user16690@gmail.com',
    age: 19,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 16690',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555fc1d7'),
    name: 'User1667',
    email: 'user1667@gmail.com',
    age: 16,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 1667',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555fd5b6'),
    name: 'User6754',
    email: 'user6754@gmail.com',
    age: 46,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 6754',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac00355608ee0'),
    name: 'User54156',
    email: 'user54156@gmail.com',
    age: 24,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 54156',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac0035560e492'),
    name: 'User76094',
    email: 'user76094@gmail.com',
    age: 44,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 76094',
    __v: 0,
    score: 0.6
  }
]
Type "it" for more
indexpoc> 

## 4. Sort by Relevance (Highest First)
indexpoc> db.users.find(
|     {
|         $text: {
|             $search: "developer"
|         }
|     },
|     {
|         score: {
|             $meta: "textScore"
|         }
|     }
| ).sort({
|     score: {
|         $meta: "textScore"
|     }
| }).pretty()
[
  {
    _id: ObjectId('6a3a2bd9b3bac003556082e8'),
    name: 'User51092',
    email: 'user51092@gmail.com',
    age: 38,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 51092',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556129a0'),
    name: 'User93772',
    email: 'user93772@gmail.com',
    age: 17,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 93772',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555ff2de'),
    name: 'User14218',
    email: 'user14218@gmail.com',
    age: 3,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 14218',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555ffa8d'),
    name: 'User16185',
    email: 'user16185@gmail.com',
    age: 1,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 16185',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556133fd'),
    name: 'User96425',
    email: 'user96425@gmail.com',
    age: 8,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 96425',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003556027d3'),
    name: 'User27775',
    email: 'user27775@gmail.com',
    age: 3,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 27775',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac00355608700'),
    name: 'User52140',
    email: 'user52140@gmail.com',
    age: 35,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 52140',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac0035560ab35'),
    name: 'User61409',
    email: 'user61409@gmail.com',
    age: 43,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 61409',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac0035561154f'),
    name: 'User88571',
    email: 'user88571@gmail.com',
    age: 59,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 88571',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003556092c5'),
    name: 'User55153',
    email: 'user55153@gmail.com',
    age: 37,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 55153',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac0035560374f'),
    name: 'User31739',
    email: 'user31739@gmail.com',
    age: 11,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 31739',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac00355611db8'),
    name: 'User90724',
    email: 'user90724@gmail.com',
    age: 54,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 90724',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003556072a3'),
    name: 'User46927',
    email: 'user46927@gmail.com',
    age: 29,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 46927',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac00355607c1d'),
    name: 'User49353',
    email: 'user49353@gmail.com',
    age: 53,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 49353',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac0035560380a'),
    name: 'User31926',
    email: 'user31926@gmail.com',
    age: 2,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 31926',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555fe58c'),
    name: 'User10808',
    email: 'user10808@gmail.com',
    age: 1,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 10808',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555ff7bf'),
    name: 'User15467',
    email: 'user15467@gmail.com',
    age: 52,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 15467',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003556004ac'),
    name: 'User18776',
    email: 'user18776@gmail.com',
    age: 43,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 18776',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac0035560aa3c'),
    name: 'User61160',
    email: 'user61160@gmail.com',
    age: 27,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 61160',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003555ff2c6'),
    name: 'User14194',
    email: 'user14194@gmail.com',
    age: 12,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 14194',
    __v: 0,
    score: 0.6
  }
]
Type "it" for more
indexpoc> 

## 5. Limit Results
indexpoc> db.users.find(
|     {
|         $text: {
|             $search: "developer"
|         }
|     },
|     {
|         score: {
|             $meta: "textScore"
|         }
|     }
| ).sort({
|     score: {
|         $meta: "textScore"
|     }
| }).limit(5).pretty()
[
  {
    _id: ObjectId('6a3a2bdab3bac0035560f532'),
    name: 'User80350',
    email: 'user80350@gmail.com',
    age: 17,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 80350',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bdab3bac0035560f3f1'),
    name: 'User80029',
    email: 'user80029@gmail.com',
    age: 55,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 80029',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac0035560933b'),
    name: 'User55271',
    email: 'user55271@gmail.com',
    age: 40,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 55271',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac003556091ce'),
    name: 'User54906',
    email: 'user54906@gmail.com',
    age: 31,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 54906',
    __v: 0,
    score: 0.6
  },
  {
    _id: ObjectId('6a3a2bd9b3bac00355607049'),
    name: 'User46325',
    email: 'user46325@gmail.com',
    age: 49,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 46325',
    __v: 0,
    score: 0.6
  }
]
indexpoc> 

## 6. Explain Text Search
indexpoc> db.users.find({
|     $text: {
|         $search: "developer"
|     }
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {
      '$text': {
        '$search': 'developer',
        '$language': 'english',
        '$caseSensitive': false,
        '$diacriticSensitive': false
      }
    },
    indexFilterSet: false,
    queryHash: '4FB85230',
    planCacheShapeHash: '4FB85230',
    planCacheKey: 'F34F3876',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'TEXT_MATCH',
      indexPrefix: {},
      indexName: 'bio_text',
      parsedTextQuery: {
        terms: [ 'develop' ],
        negatedTerms: [],
        phrases: [],
        negatedPhrases: []
      },
      textIndexVersion: 3,
      inputStage: {
        stage: 'FETCH',
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: { _fts: 'text', _ftsx: 1 },
          indexName: 'bio_text',
          isMultiKey: true,
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'backward',
          indexBounds: {}
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 100000,
    executionTimeMillis: 151,
    totalKeysExamined: 100000,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'TEXT_MATCH',
      nReturned: 100000,
      executionTimeMillisEstimate: 125,
      works: 100001,
      advanced: 100000,
      needTime: 0,
      needYield: 0,
      saveState: 11,
      restoreState: 11,
      isEOF: 1,
      indexPrefix: {},
      indexName: 'bio_text',
      parsedTextQuery: {
        terms: [ 'develop' ],
        negatedTerms: [],
        phrases: [],
        negatedPhrases: []
      },
      textIndexVersion: 3,
      docsRejected: 0,
      inputStage: {
        stage: 'FETCH',
        nReturned: 100000,
        executionTimeMillisEstimate: 125,
        works: 100001,
        advanced: 100000,
        needTime: 0,
        needYield: 0,
        saveState: 11,
        restoreState: 11,
        isEOF: 1,
        docsExamined: 100000,
        alreadyHasObj: 0,
        inputStage: {
          stage: 'IXSCAN',
          nReturned: 100000,
          executionTimeMillisEstimate: 68,
          works: 100001,
          advanced: 100000,
          needTime: 0,
          needYield: 0,
          saveState: 11,
          restoreState: 11,
          isEOF: 1,
          keyPattern: { _fts: 'text', _ftsx: 1 },
          indexName: 'bio_text',
          isMultiKey: true,
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'backward',
          indexBounds: {},
          keysExamined: 100000,
          seeks: 1,
          dupsTested: 100000,
          dupsDropped: 0
        }
      }
    }
  },
  queryShapeHash: '972C5AF364E7BBCB5DB0C2CF3FC91B7EB783038A96A146537EDE23F1CFF6B42D',
  command: {
    find: 'users',
    filter: { '$text': { '$search': 'developer' } },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

## 7. Search for Specific Phrase
indexpoc> db.users.find({
|     $text: {
|         $search: "\"MERN Stack\""
|     }
| }).pretty()
[
  {
    _id: ObjectId('6a3a2bdab3bac003556141f3'),
    name: 'User99999',
    email: 'user99999@gmail.com',
    age: 22,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99999',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f2'),
    name: 'User99998',
    email: 'user99998@gmail.com',
    age: 40,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99998',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f1'),
    name: 'User99997',
    email: 'user99997@gmail.com',
    age: 18,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99997',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f0'),
    name: 'User99996',
    email: 'user99996@gmail.com',
    age: 57,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99996',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ef'),
    name: 'User99995',
    email: 'user99995@gmail.com',
    age: 35,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99995',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ee'),
    name: 'User99994',
    email: 'user99994@gmail.com',
    age: 34,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99994',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ed'),
    name: 'User99993',
    email: 'user99993@gmail.com',
    age: 1,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99993',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ec'),
    name: 'User99992',
    email: 'user99992@gmail.com',
    age: 31,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99992',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141eb'),
    name: 'User99991',
    email: 'user99991@gmail.com',
    age: 30,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99991',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ea'),
    name: 'User99990',
    email: 'user99990@gmail.com',
    age: 59,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99990',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e9'),
    name: 'User99989',
    email: 'user99989@gmail.com',
    age: 39,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99989',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e8'),
    name: 'User99988',
    email: 'user99988@gmail.com',
    age: 55,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99988',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e7'),
    name: 'User99987',
    email: 'user99987@gmail.com',
    age: 23,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99987',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e6'),
    name: 'User99986',
    email: 'user99986@gmail.com',
    age: 42,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99986',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e5'),
    name: 'User99985',
    email: 'user99985@gmail.com',
    age: 24,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99985',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e4'),
    name: 'User99984',
    email: 'user99984@gmail.com',
    age: 59,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99984',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e3'),
    name: 'User99983',
    email: 'user99983@gmail.com',
    age: 40,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99983',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e2'),
    name: 'User99982',
    email: 'user99982@gmail.com',
    age: 29,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99982',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e1'),
    name: 'User99981',
    email: 'user99981@gmail.com',
    age: 47,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99981',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e0'),
    name: 'User99980',
    email: 'user99980@gmail.com',
    age: 57,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99980',
    __v: 0
  }
]
Type "it" for more
indexpoc> 

## 8. Search with Exclusion
indexpoc> db.users.find({
|     $text: {
|         $search: "Developer -Senior"
|     }
| }).count()
0
*Create Mixed Data* To test exclusion properly, you need documents that DON'T have "Senior":-
indexpoc> db.users.insertMany([
|     {
|         name: "JuniorDev1",
|         email: "junior1@test.com",
|         age: 22,
|         status: "active",
|         skills: ["React", "Node"],
|         bio: "Junior Developer learning MERN Stack"
|     },
|     {
|         name: "JuniorDev2",
|         email: "junior2@test.com",
|         age: 24,
|         status: "inactive",
|         skills: ["Python", "Django"],
|         bio: "Python Developer and Data Analyst"
|     },
|     {
|         name: "JuniorDev3",
|         email: "junior3@test.com",
|         age: 23,
|         status: "active",
|         skills: ["Java", "Spring"],
|         bio: "Java Developer building APIs"
|     },
|     {
|         name: "JuniorDev4",
|         email: "junior4@test.com",
|         age: 25,
|         status: "active",
|         skills: ["Go", "Docker"],
|         bio: "Go Developer and DevOps Engineer"
|     }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a3a2eb1f437a123b8d1a7bb'),
    '1': ObjectId('6a3a2eb1f437a123b8d1a7bc'),
    '2': ObjectId('6a3a2eb1f437a123b8d1a7bd'),
    '3': ObjectId('6a3a2eb1f437a123b8d1a7be')
  }
}
indexpoc> db.users.find({
|     $text: {
|         $search: "developer -senior"
|     }
| }).pretty()
[
  {
    _id: ObjectId('6a3a2eb1f437a123b8d1a7be'),
    name: 'JuniorDev4',
    email: 'junior4@test.com',
    age: 25,
    status: 'active',
    skills: [ 'Go', 'Docker' ],
    bio: 'Go Developer and DevOps Engineer'
  },
  {
    _id: ObjectId('6a3a2eb1f437a123b8d1a7bd'),
    name: 'JuniorDev3',
    email: 'junior3@test.com',
    age: 23,
    status: 'active',
    skills: [ 'Java', 'Spring' ],
    bio: 'Java Developer building APIs'
  },
  {
    _id: ObjectId('6a3a2eb1f437a123b8d1a7bc'),
    name: 'JuniorDev2',
    email: 'junior2@test.com',
    age: 24,
    status: 'inactive',
    skills: [ 'Python', 'Django' ],
    bio: 'Python Developer and Data Analyst'
  },
  {
    _id: ObjectId('6a3a2eb1f437a123b8d1a7bb'),
    name: 'JuniorDev1',
    email: 'junior1@test.com',
    age: 22,
    status: 'active',
    skills: [ 'React', 'Node' ],
    bio: 'Junior Developer learning MERN Stack'
  }
]
indexpoc> 

## 9. Search with Language Support
indexpoc> db.users.find({
|     $text: {
|         $search: "DEVELOPER"
|     }
| }).pretty()
[
  {
    _id: ObjectId('6a3a2bdab3bac003556141f3'),
    name: 'User99999',
    email: 'user99999@gmail.com',
    age: 22,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99999',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f2'),
    name: 'User99998',
    email: 'user99998@gmail.com',
    age: 40,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99998',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f1'),
    name: 'User99997',
    email: 'user99997@gmail.com',
    age: 18,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99997',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141f0'),
    name: 'User99996',
    email: 'user99996@gmail.com',
    age: 57,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99996',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ef'),
    name: 'User99995',
    email: 'user99995@gmail.com',
    age: 35,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99995',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ee'),
    name: 'User99994',
    email: 'user99994@gmail.com',
    age: 34,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99994',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ed'),
    name: 'User99993',
    email: 'user99993@gmail.com',
    age: 1,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99993',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ec'),
    name: 'User99992',
    email: 'user99992@gmail.com',
    age: 31,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99992',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141eb'),
    name: 'User99991',
    email: 'user99991@gmail.com',
    age: 30,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99991',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141ea'),
    name: 'User99990',
    email: 'user99990@gmail.com',
    age: 59,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99990',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e9'),
    name: 'User99989',
    email: 'user99989@gmail.com',
    age: 39,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99989',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e8'),
    name: 'User99988',
    email: 'user99988@gmail.com',
    age: 55,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99988',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e7'),
    name: 'User99987',
    email: 'user99987@gmail.com',
    age: 23,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99987',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e6'),
    name: 'User99986',
    email: 'user99986@gmail.com',
    age: 42,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99986',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e5'),
    name: 'User99985',
    email: 'user99985@gmail.com',
    age: 24,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99985',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e4'),
    name: 'User99984',
    email: 'user99984@gmail.com',
    age: 59,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99984',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e3'),
    name: 'User99983',
    email: 'user99983@gmail.com',
    age: 40,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99983',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e2'),
    name: 'User99982',
    email: 'user99982@gmail.com',
    age: 29,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99982',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e1'),
    name: 'User99981',
    email: 'user99981@gmail.com',
    age: 47,
    status: 'inactive',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99981',
    __v: 0
  },
  {
    _id: ObjectId('6a3a2bdab3bac003556141e0'),
    name: 'User99980',
    email: 'user99980@gmail.com',
    age: 57,
    status: 'active',
    skills: [ 'Node', 'React', 'MongoDB' ],
    bio: 'Senior MERN Stack Developer 99980',
    __v: 0
  }
]
Type "it" for more
indexpoc> 

## 10. Count Results
indexpoc> db.users.find({
|     $text: {
|         $search: "developer"
|     }
| }).count()
100000
indexpoc> 

## Text Index Limitation:
Only one text index per collection.
db.users.createIndex({
   bio:"text"
})
db.users.createIndex({
   skills:"text"
})
Error ❌.
Solution:
db.users.createIndex({
    bio:"text",
    skills:"text"
})
Single text index ✅.

# Interview Questions
*Difference between regex and text index?*
Regex:
COLLSCAN usually
Text:
Uses text index
*Can a collection have multiple text indexes?*
No
Only one text index per collection.

## Sparse Index:
----------------
*Terminal log*:
indexpoc> db.users.createIndex(
|     { email: 1 },
|     { sparse: true }
| )
MongoServerError[IndexKeySpecsConflict]: An existing index has the same name as the requested index. When index names are not specified, they are auto generated and can cause conflicts. Please refer to our documentation. Requested index: { v: 2, key: { email: 1 }, name: "email_1", sparse: true }, existing index: { v: 2, key: { email: 1 }, name: "email_1" }
indexpoc> db.users.dropIndex("email_1")
{ nIndexesWas: 6, ok: 1 }
indexpoc> db.users.createIndex(
|     { email: 1 },
|     { sparse: true }
| )
email_1
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' },
  { v: 2, key: { status: 1 }, name: 'status_1' },
  {
    v: 2,
    key: { _fts: 'text', _ftsx: 1 },
    name: 'bio_text',
    weights: { bio: 1 },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: 3
  },
  { v: 2, key: { email: 1, status: 1 }, name: 'email_1_status_1' },
  { v: 2, key: { email: 1 }, name: 'email_1', sparse: true }
]
indexpoc> 
*Insert Test Data*
indexpoc> db.users.insertMany([
|     { name: "John", email: "john@gmail.com", age: 25 },
|     { name: "David", age: 30 },
|     { name: "Mike", age: 28 }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a3a306ef437a123b8d1a7bf'),
    '1': ObjectId('6a3a306ef437a123b8d1a7c0'),
    '2': ObjectId('6a3a306ef437a123b8d1a7c1')
  }
}
*Query with Email (Uses Sparse Index)*:
indexpoc> db.users.find({ email: "john@gmail.com" }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'john@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'A3EDD7E3',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: true,                                                                                     // --> *sparse true*
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["john@gmail.com", "john@gmail.com"]' ] }
      }
    },
    rejectedPlans: [
      {
        isCached: false,
        stage: 'FETCH',
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: { email: 1, status: 1 },
          indexName: 'email_1_status_1',
          isMultiKey: false,
          multiKeyPaths: { email: [], status: [] },
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: {
            email: [ '["john@gmail.com", "john@gmail.com"]' ],
            status: [ '[MinKey, MaxKey]' ]
          }
        }
      }
    ]
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 1,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 3,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: true,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["john@gmail.com", "john@gmail.com"]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'john@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
*Query for Missing Email (Cannot Use Sparse Index)*:
= Sparse index = Only index documents that have the field
= Doesn't work for: { email: { $exists: false } }
Logs:-
indexpoc> db.users.find({ email: { $exists: false } }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$not': { '$exists': true } } },
    indexFilterSet: false,
    queryHash: 'A97C83CE',
    planCacheShapeHash: 'A97C83CE',
    planCacheKey: '7AF65D24',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      filter: { email: { '$not': { '$exists': true } } },
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,                                                                            // --> *sparse false*
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '[null, null]' ], status: [ '[MinKey, MaxKey]' ] }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 2,
    executionTimeMillis: 0,
    totalKeysExamined: 2,
    totalDocsExamined: 2,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      filter: { email: { '$not': { '$exists': true } } },
      nReturned: 2,
      executionTimeMillisEstimate: 0,
      works: 3,
      advanced: 2,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 2,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 2,
        executionTimeMillisEstimate: 0,
        works: 3,
        advanced: 2,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '[null, null]' ], status: [ '[MinKey, MaxKey]' ] },
        keysExamined: 2,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '8CA8143E82648EB651C5DAD2BB91566B6940A88EE67607372BEB1FBA80F6DED2',
  command: {
    find: 'users',
    filter: { email: { '$exists': false } },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

# Key Takeaways:
Query	                          Sparse Index Used?	           Why?
{ email: "john@gmail.com" }	    ✅ YES (isSparse: true)	   Email EXISTS → Indexed
{ email: { $exists: false } }	❌ NO (isSparse: false)	   Email MISSING → Not indexed


## Sparse Index Rule:
Sparse Index = Only indexes documents WITH the field

Documents:
┌─────────────────────────────┐
│ { email: "john@gmail.com" } │ → ✅ Indexed (has email)
│ { name: "David" }           │ → ❌ Skipped (no email)
│ { name: "Mike" }            │ → ❌ Skipped (no email)
└─────────────────────────────┘

Query: { email: "john@gmail.com" } → Uses sparse index ✅
Query: { email: { $exists: false } } → Cannot use sparse index ❌

# What Problem Does Sparse Index Solve?
1. Without Sparse Index:
// Index on email (without sparse)
db.users.createIndex({ email: 1 })
// MongoDB indexes ALL documents, even those without email                                        -->*important notes*
// Index size includes NULL values for missing fields
// Memory: Larger index → More RAM usage
// Performance: Slower inserts/updates
2. With Sparse Index:
// Index on email (with sparse)
db.users.createIndex({ email: 1 }, { sparse: true })
// MongoDB indexes ONLY documents that HAVE email                                                 -->*important notes*
// Documents without email: Skipped entirely
// Memory: Smaller index → Less RAM usage
// Performance: Faster inserts/updates

## When to Use Sparse Index:
1. Optional Fields -> User has optional 'phone' field, Only users with phone numbers get indexed, Reduces index size if most users don't have phone.
2. Sparse + Unique -> Allow multiple users without email, but enforce unique email if provided
*Example:*
db.users.createIndex(
    { email: 1 },
    { unique: true, sparse: true }
)

// ✅ Multiple users can have NO email
db.users.insertMany([
    { name: "John" },      // ✅ No email - allowed
    { name: "David" }      // ✅ No email - allowed
])

// ❌ Cannot have duplicate emails
db.users.insert({ email: "john@gmail.com" }) // ✅ Allowed
db.users.insert({ email: "john@gmail.com" }) // ❌ Duplicate error!
3. Large Collections with Sparse Field -> 1 million users, only 10% have 'twitter' handle, Index only 100,000 documents instead of 1,000,000, Saves 90% index memory!

## When NOT to Use Sparse Index:
1. Almost All Documents Have the Field
2. You want consistent query results for missing fields
*simply you want the result with its missing fields*

## Interview Question
Sparse index stores:
Only documents where field exists.


## Partial Index
----------------
*What is Partial Index?*
Partial Index indexes only documents that match a filter condition. Documents that don't match the condition are completely skipped.

Partial Index = Index only a SUBSET of documents
              = Like a "where clause" for your index

*Terminal Logs*:
indexpoc> db.users.deleteMany({})
{ acknowledged: true, deletedCount: 100007 }
indexpoc> db.users.insertMany([
|     {
|         name: "John",
|         email: "john@gmail.com",
|         status: "active",
|         age: 25
|     },
|     {
|         name: "David",
|         email: "david@gmail.com",
|         status: "inactive",
|         age: 30
|     },
|     {
|         name: "Mike",
|         email: "mike@gmail.com",
|         status: "inactive",
|         age: 28
|     },
|     {
|         name: "Sarah",
|         email: "sarah@gmail.com",
|         status: "active",
|         age: 26
|     }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a3a45bcf437a123b8d1a7c2'),
    '1': ObjectId('6a3a45bcf437a123b8d1a7c3'),
    '2': ObjectId('6a3a45bcf437a123b8d1a7c4'),
    '3': ObjectId('6a3a45bcf437a123b8d1a7c5')
  }
}
indexpoc> db.users.createIndex(
|     { email: 1 },
|     {
|         partialFilterExpression: {
|             status: "active"
|         }
|     }
| )
| 
MongoServerError[IndexKeySpecsConflict]: An existing index has the same name as the requested index. When index names are not specified, they are auto generated and can cause conflicts. Please refer to our documentation. Requested index: { v: 2, key: { email: 1 }, name: "email_1", partialFilterExpression: { status: "active" } }, existing index: { v: 2, key: { email: 1 }, name: "email_1", sparse: true }
indexpoc> db.users.dropIndex("email_1")
{ nIndexesWas: 6, ok: 1 }
indexpoc> db.users.createIndex(
|     { email: 1 },
|     {
|         partialFilterExpression: {
|             status: "active"
|         }
|     }
| )
| 
email_1
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' },
  { v: 2, key: { status: 1 }, name: 'status_1' },
  {
    v: 2,
    key: { _fts: 'text', _ftsx: 1 },
    name: 'bio_text',
    weights: { bio: 1 },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: 3
  },
  { v: 2, key: { email: 1, status: 1 }, name: 'email_1_status_1' },
  {
    v: 2,
    key: { email: 1 },
    name: 'email_1',
    partialFilterExpression: { status: 'active' }
  }
]
indexpoc> db.users.find({
|     email: "john@gmail.com",
|     status: "active"
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {
      '$and': [
        { email: { '$eq': 'john@gmail.com' } },
        { status: { '$eq': 'active' } }
      ]
    },
    indexFilterSet: false,
    queryHash: '898694C1',
    planCacheShapeHash: '898694C1',
    planCacheKey: '13505DCC',
    optimizationTimeMillis: 2,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '["john@gmail.com", "john@gmail.com"]' ],                                    ---> *Create Partial Index*
          status: [ '["active", "active"]' ]
        }
      }
    },
    rejectedPlans: [
      {
        isCached: false,
        stage: 'FETCH',
        filter: { email: { '$eq': 'john@gmail.com' } },
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: { status: 1 },
          indexName: 'status_1',
          isMultiKey: false,
          multiKeyPaths: { status: [] },
          isUnique: false,
          isSparse: false,
          isPartial: false,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: { status: [ '["active", "active"]' ] }
        }
      },
      {
        isCached: false,
        stage: 'FETCH',
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: { email: 1 },
          indexName: 'email_1',
          isMultiKey: false,
          multiKeyPaths: { email: [] },
          isUnique: false,
          isSparse: false,
          isPartial: true,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: { email: [ '["john@gmail.com", "john@gmail.com"]' ] }
        }
      }
    ]
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 0,
    executionTimeMillis: 3,
    totalKeysExamined: 0,
    totalDocsExamined: 0,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 0,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 0,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 0,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 0,
        executionTimeMillisEstimate: 0,
        works: 1,
        advanced: 0,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '["john@gmail.com", "john@gmail.com"]' ],
          status: [ '["active", "active"]' ]
        },
        keysExamined: 0,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BB12058DBB1D2E0850DC51BCEB6776CEA48C57A2B0D7F53FCAFB538C3C95770C',
  command: {
    find: 'users',
    filter: { email: 'john@gmail.com', status: 'active' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> db.users.find({
|     email: "david@gmail.com"
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'david@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: '8CAD1365',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,                                                                       --->*partial index false*
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '["david@gmail.com", "david@gmail.com"]' ],
          status: [ '[MinKey, MaxKey]' ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 0,
    executionTimeMillis: 0,
    totalKeysExamined: 0,
    totalDocsExamined: 0,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 0,
      executionTimeMillisEstimate: 0,
      works: 1,
      advanced: 0,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 0,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 0,
        executionTimeMillisEstimate: 0,
        works: 1,
        advanced: 0,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1, status: 1 },
        indexName: 'email_1_status_1',
        isMultiKey: false,
        multiKeyPaths: { email: [], status: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [ '["david@gmail.com", "david@gmail.com"]' ],
          status: [ '[MinKey, MaxKey]' ]
        },
        keysExamined: 0,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'david@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

MongoDB's Decision:
Winning Plan: email_1_status_1 (compound index)
Rejected Plans: None

Why?
1. David is inactive
2. Partial index email_1 only has active users
3. Compound index email_1_status_1 has all users
4. MongoDB picks the compound index ✅

*after drop the email then partial is working correctly*
indexpoc> db.users.dropIndex("email_1_status_1")
{ nIndexesWas: 6, ok: 1 }
indexpoc> db.users.find({ 
|     email: "john@gmail.com", 
|     status: "active" 
| })
indexpoc> db.users.find({ 
|     email: "john@gmail.com", 
|     status: "active" 
| }).hint("email_1").explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {
      '$and': [
        { email: { '$eq': 'john@gmail.com' } },
        { status: { '$eq': 'active' } }
      ]
    },
    indexFilterSet: false,
    queryHash: '898694C1',
    planCacheShapeHash: '898694C1',
    planCacheKey: '6AD8D99F',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: true,                                                                                --->*partial index true*
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["john@gmail.com", "john@gmail.com"]' ] }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 0,
    executionTimeMillis: 0,
    totalKeysExamined: 0,
    totalDocsExamined: 0,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 0,
      executionTimeMillisEstimate: 0,
      works: 1,
      advanced: 0,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 0,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 0,
        executionTimeMillisEstimate: 0,
        works: 1,
        advanced: 0,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: true,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["john@gmail.com", "john@gmail.com"]' ] },
        keysExamined: 0,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BB12058DBB1D2E0850DC51BCEB6776CEA48C57A2B0D7F53FCAFB538C3C95770C',
  command: {
    find: 'users',
    filter: { email: 'john@gmail.com', status: 'active' },
    hint: 'email_1',
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 
indexpoc> db.users.find({
|     email: "david@gmail.com"
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'david@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'C924A531',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { email: { '$eq': 'david@gmail.com' } },                            // -> *David is NOT in the partial index ❌, so scan all to find david*
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 0,
    executionTimeMillis: 44,
    totalKeysExamined: 0,
    totalDocsExamined: 100000,                                                     // -> *examined all* using COLLSCAN
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { email: { '$eq': 'david@gmail.com' } },
      nReturned: 0,
      executionTimeMillisEstimate: 41,
      works: 100001,
      advanced: 0,
      needTime: 100000,
      needYield: 0,
      saveState: 2,
      restoreState: 2,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 100000
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'david@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

## Why isPartial: false Shows as COLLSCAN?
The Answer:
---> When you dropped the compound index email_1_status_1, MongoDB can no longer use an index for inactive users (like David) because:
1. Partial index email_1 → Only contains active users
2. David is inactive → NOT in the partial index ❌
3. No other index → MongoDB must scan ALL documents (COLLSCAN)

## This is one of the most powerful real-world use cases for partial indexes!:
The Problem: Soft Delete Pattern
What is Soft Delete?
Instead of physically deleting documents, you mark them as isDeleted: true. This allows:
✅ Data recovery
✅ Audit trails
✅ Undo operations
✅ Historical data

*Terminal logs:*
indexpoc> db.users.insertMany([
    {
        name: "John",
        email: "john@gmail.com",
        isDeleted: false,
        age: 25,
        createdAt: new Date()
    },
    {
        name: "Mike",
        email: "mike@gmail.com",
        isDeleted: true,
        age: 30,
        createdAt: new Date(),
        deletedAt: new Date()
    },
    {
        name: "Sarah",
        email: "sarah@gmail.com",
        isDeleted: false,
        age: 28,
        createdAt: new Date()
    },
    {
        name: "David",
        email: "david@gmail.com",
        isDeleted: true,
        age: 35,
        createdAt: new Date(),
        deletedAt: new Date()
    },
    {
        name: "Emma",
        email: "emma@gmail.com",
        isDeleted: false,
        age: 26,
        createdAt: new Date()
    }
])
indexpoc> db.users.dropIndex("email_1")
{ nIndexesWas: 5, ok: 1 }
indexpoc> db.users.getIndex()
TypeError: db.users.getIndex is not a function
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { skills: 1 }, name: 'skills_1' },
  { v: 2, key: { status: 1 }, name: 'status_1' },
  {
    v: 2,
    key: { _fts: 'text', _ftsx: 1 },
    name: 'bio_text',
    weights: { bio: 1 },
    default_language: 'english',
    language_override: 'language',
    textIndexVersion: 3
  }
]
# Create partial index - only non-deleted users
indexpoc> db.users.createIndex(
|     { email: 1 },
|     {
|         partialFilterExpression: {
|             isDeleted: false
|         },
|         name: "email_1_active"
|     }
| )
email_1_active
# Create compound partial index
indexpoc> db.users.createIndex(
|     { email: 1, name: 1 },
|     {
|         partialFilterExpression: {
|             isDeleted: false
|         },
|         name: "email_name_active"
|     }
| )
| 
email_name_active
# Create index on name only
indexpoc> db.users.createIndex(
|     { name: 1 },
|     {
|         partialFilterExpression: {
|             isDeleted: false
|         },
|         name: "name_active"
|     }
| )
name_active
# ✅ Query uses partial index
indexpoc> db.users.find({
|     email: "john@gmail.com",
|     isDeleted: false
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {
      '$and': [
        { email: { '$eq': 'john@gmail.com' } },
        { isDeleted: { '$eq': false } }
      ]
    },
    indexFilterSet: false,
    queryHash: 'AE07E848',
    planCacheShapeHash: 'AE07E848',
    planCacheKey: '476EEEC3',
    optimizationTimeMillis: 2,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1 },
        indexName: 'email_1_active',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: true,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["john@gmail.com", "john@gmail.com"]' ] }
      }
    },
    rejectedPlans: [
      {
        isCached: false,
        stage: 'FETCH',
        inputStage: {
          stage: 'IXSCAN',
          keyPattern: { email: 1, name: 1 },
          indexName: 'email_name_active',
          isMultiKey: false,
          multiKeyPaths: { email: [], name: [] },
          isUnique: false,
          isSparse: false,
          isPartial: true,
          indexVersion: 2,
          direction: 'forward',
          indexBounds: {
            email: [ '["john@gmail.com", "john@gmail.com"]' ],
            name: [ '[MinKey, MaxKey]' ]
          }
        }
      }
    ]
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 2,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 3,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1 },
        indexName: 'email_1_active',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: true,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["john@gmail.com", "john@gmail.com"]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '8E06D411B8BDDCB457DC220935DAA7429D6C3400F04D902B4DFCF8E85A85B0B4',
  command: {
    find: 'users',
    filter: { email: 'john@gmail.com', isDeleted: false },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
# ❌ Query won't use partial index (missing isDeleted)
indexpoc> db.users.find({
|     email: "mike@gmail.com"
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'mike@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: '83223BD0',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { email: { '$eq': 'mike@gmail.com' } },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 44,
    totalKeysExamined: 0,
    totalDocsExamined: 100005,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { email: { '$eq': 'mike@gmail.com' } },
      nReturned: 1,
      executionTimeMillisEstimate: 34,
      works: 100006,
      advanced: 1,
      needTime: 100004,
      needYield: 0,
      saveState: 2,
      restoreState: 2,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 100005
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'mike@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
# ✅ Query uses partial index
indexpoc> db.users.find({
|     name: "John",
|     isDeleted: false
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: {
      '$and': [ { isDeleted: { '$eq': false } }, { name: { '$eq': 'John' } } ]
    },
    indexFilterSet: false,
    queryHash: '44A6D664',
    planCacheShapeHash: '44A6D664',
    planCacheKey: '9DCD9AD2',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { name: 1 },
        indexName: 'name_active',
        isMultiKey: false,
        multiKeyPaths: { name: [] },
        isUnique: false,
        isSparse: false,
        isPartial: true,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { name: [ '["John", "John"]' ] }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 1,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { name: 1 },
        indexName: 'name_active',
        isMultiKey: false,
        multiKeyPaths: { name: [] },
        isUnique: false,
        isSparse: false,
        isPartial: true,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { name: [ '["John", "John"]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '4843B57A59790C0EAAB366C96E9E8120FABBADF19633E15B3A6D73E062EA4DB3',
  command: {
    find: 'users',
    filter: { name: 'John', isDeleted: false },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

# Sparse vs Partial
Interview Favorite.
Sparse:-
Rule:
Field exists
Example:
{
 email:1
}
Indexes:
{
 email:"a@gmail.com"
}
Not:
{}

Partial:-
Rule:
Custom condition
Example:
{
 status:"active"
}
Indexes only matching documents.

*Senior-Level Answer*:
Sparse:
Indexes documents where field exists.
Partial:
Indexes documents satisfying a filter expression.

Partial is more flexible and generally preferred.



## Unique Index:
---------------------------------------------------
indexpoc> db.users.drop()
true
indexpoc> db.users.insertMany([
| {
|     name:"John",
|     email:"john@gmail.com"
| },
| {
|     name:"David",
|     email:"david@gmail.com"
| }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a3a508ff437a123b8d1a7cb'),
    '1': ObjectId('6a3a508ff437a123b8d1a7cc')
  }
}
indexpoc> db.users.find()
[
  {
    _id: ObjectId('6a3a508ff437a123b8d1a7cb'),
    name: 'John',
    email: 'john@gmail.com'
  },
  {
    _id: ObjectId('6a3a508ff437a123b8d1a7cc'),
    name: 'David',
    email: 'david@gmail.com'
  }
]
indexpoc> db.users.createIndex(
| {
|    email:1
| },
| {
|    unique:true
| }
| )
email_1
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1', unique: true }
]
indexpoc> db.users.insertOne({
|    name:"Mike",
|    email:"john@gmail.com"
| })
MongoServerError: E11000 duplicate key error collection: indexpoc.users index: email_1 dup key: { email: "john@gmail.com" }
indexpoc> 

# Why?

Index stores:
john@gmail.com
david@gmail.com

When inserting:
john@gmail.com

* Mongo finds it already exists.
* Rejects insert.

*Explain Interview Answer*
Unique Index does TWO things:
1. Fast Search
2. Prevent Duplicates


## Interesting Test:
-------------------
indexpoc> db.users.drop()
true
indexpoc> db.users.insertMany([
| {
|     name:"A"
| },
| {
|     name:"B"
| }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a3a51a5f437a123b8d1a7d3'),
    '1': ObjectId('6a3a51a5f437a123b8d1a7d4')
  }
}
indexpoc> db.users.createIndex(
| {
|     email:1
| },
| {
|     unique:true
| }
| )
MongoServerError[DuplicateKey]: Index build failed: b686e7c3-b054-4ebd-9c86-3db134695fe5: Collection indexpoc.users ( af7b1f5d-bf0b-4d11-a10f-bf57d1f9f2ed ) :: caused by :: E11000 duplicate key error collection: indexpoc.users index: email_1 dup key: { email: null }
indexpoc> 
*while creating unique if its already as duplicate it will provide error*

Why?
Mongo treats missing email as:
null

Unique index allows only one null.


# Unique + Sparse:
------------------
indexpoc> db.users.drop()
true
indexpoc> db.users.createIndex(
|     { email: 1 },
|     { unique: true, sparse: true }
| )
email_1
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  {
    v: 2,
    key: { email: 1 },
    name: 'email_1',
    unique: true,
    sparse: true
  }
]
indexpoc> db.users.insertOne({ name: "A" })
{
  acknowledged: true,
  insertedId: ObjectId('6a3a5297f437a123b8d1a7d6')
}
indexpoc> db.users.insertOne({ name: "B" })
{
  acknowledged: true,
  insertedId: ObjectId('6a3a529cf437a123b8d1a7d7')
}
indexpoc> db.users.insertOne({ name: "C" })
{
  acknowledged: true,
  insertedId: ObjectId('6a3a52a1f437a123b8d1a7d8')
}
indexpoc> db.users.insertOne({ 
|     name: "D", 
|     email: "d@gmail.com" 
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a3a52abf437a123b8d1a7d9')
}
indexpoc> db.users.insertOne({ 
|     name: "E", 
|     email: "e@gmail.com" 
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a3a52b2f437a123b8d1a7da')
}
indexpoc> db.users.insertOne({ 
|     name: "F", 
|     email: "d@gmail.com"  // ← DUPLICATE!
| })
MongoServerError: E11000 duplicate key error collection: indexpoc.users index: email_1 dup key: { email: "d@gmail.com" }

indexpoc> db.users.find().pretty()
[
  { _id: ObjectId('6a3a5297f437a123b8d1a7d6'), name: 'A' },
  { _id: ObjectId('6a3a529cf437a123b8d1a7d7'), name: 'B' },
  { _id: ObjectId('6a3a52a1f437a123b8d1a7d8'), name: 'C' },
  {
    _id: ObjectId('6a3a52abf437a123b8d1a7d9'),
    name: 'D',
    email: 'd@gmail.com'
  },
  {
    _id: ObjectId('6a3a52b2f437a123b8d1a7da'),
    name: 'E',
    email: 'e@gmail.com'
  }
]
# Query with email (Uses index)
indexpoc> db.users.find({ 
|     email: "d@gmail.com" 
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'd@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'F713C797',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'EXPRESS_IXSCAN',
      keyPattern: '{ email: 1 }',
      indexName: 'email_1'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 0,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'EXPRESS_IXSCAN',
      keyPattern: '{ email: 1 }',
      indexName: 'email_1',
      keysExamined: 1,
      docsExamined: 1,
      nReturned: 1
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'd@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
# Query without email (Doesn't use index)
indexpoc> db.users.find({ 
|     name: "A" 
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { name: { '$eq': 'A' } },
    indexFilterSet: false,
    queryHash: 'F4DDDCDC',
    planCacheShapeHash: 'F4DDDCDC',
    planCacheKey: 'E45FBFA1',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { name: { '$eq': 'A' } },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 0,
    totalKeysExamined: 0,
    totalDocsExamined: 5,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { name: { '$eq': 'A' } },
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 6,
      advanced: 1,
      needTime: 4,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 5
    }
  },
  queryShapeHash: '62E895195C0B35FC5D84BEFD523E2E1F35E2C77F544535B2AE18B41AF2748B9B',
  command: { find: 'users', filter: { name: 'A' }, '$db': 'indexpoc' },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 
*Sparse = Skip documents without the field*
1. Without sparse: Missing fields = null → Duplicate error ❌
2. With sparse: Missing fields = Skip → No error ✅

*Important Notes*: Documents without email are SKIPPED IN THE INDEX, but they STILL exist in the collection and ARE returned in queries.     -->*****
One-Liner Conclusion:-
> **Sparse index = Only INDEXES documents with the field, but ALL documents are still returned in queries!** 🎯


# TTL Index:
-------------------------------------------
TTL = Time To Live
Mongo automatically deletes documents after a period.

*Real Use Cases*
OTP
Session
Login Token
Cache
Password Reset Link

*Terminal Logs*:
indexpoc> db.logs.insertMany([
|     { message: "Log 1", createdAt: new Date() },
|     { message: "Log 2", createdAt: new Date() },
|     { message: "Log 3", createdAt: new Date() }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a3a57d7f437a123b8d1a7dc'),
    '1': ObjectId('6a3a57d7f437a123b8d1a7dd'),
    '2': ObjectId('6a3a57d7f437a123b8d1a7de')
  }
}
indexpoc> db.logs.createIndex(
|     { createdAt: 1 },
|     { expireAfterSeconds: 60 }
| )
createdAt_1
indexpoc> db.logs.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  {
    v: 2,
    key: { createdAt: 1 },
    name: 'createdAt_1',
    expireAfterSeconds: 60
  }
]
indexpoc> 
indexpoc> db.logs.find()
[
  {
    _id: ObjectId('6a3a57d7f437a123b8d1a7dc'),
    message: 'Log 1',
    createdAt: ISODate('2026-06-23T09:54:31.458Z')
  },
  {
    _id: ObjectId('6a3a57d7f437a123b8d1a7dd'),
    message: 'Log 2',
    createdAt: ISODate('2026-06-23T09:54:31.458Z')
  },
  {
    _id: ObjectId('6a3a57d7f437a123b8d1a7de'),
    message: 'Log 3',
    createdAt: ISODate('2026-06-23T09:54:31.458Z')
  }
]
* Wait 1 minute...
indexpoc> db.logs.find()

indexpoc> 
*its completed docs are deleted*

## Different TTL Examples:
1. Delete After 1 Hour:
db.logs.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 3600 }  // 60 * 60
)
2. Delete After 1 Day:
db.logs.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 86400 }  // 24 * 60 * 60
)
3. Delete After 1 Week:
db.logs.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 604800 }  // 7 * 24 * 60 * 60
)
4. Delete After 30 Days:
db.logs.createIndex(
    { createdAt: 1 },
    { expireAfterSeconds: 2592000 }  // 30 * 24 * 60 * 60
)

# Real-World Examples:
1. Real-World Examples
2. OTP/Tokens
3. Logs

# Important Rules:
✅ Documents MUST have:
// Field must be Date type
{ 
    message: "Log",
    createdAt: new Date()  // ← Must be Date
}
❌ Documents without Date field:
{ message: "Log" }  // No createdAt field → Won't be deleted


## Hashed Index:
--------------------------------------
*Purpose*:
NOT for searching.
NOT for sorting.

Main purpose:
Sharding

Even data distribution.

*Terminal Logs*:
indexpoc> db.users.drop()
true
indexpoc> for (let i = 1; i <= 10000; i++) {
|     db.users.insertOne({
|         userId: i
|     })
| }
{
  acknowledged: true,
  insertedId: ObjectId('6a3a5990f437a123b8d1ceee')
}
indexpoc> db.users.count()
DeprecationWarning: Collection.count() is deprecated. Use countDocuments or estimatedDocumentCount.
10000
indexpoc> 
indexpoc> db.users.createIndex({
|     userId: "hashed"  // ← "hashed" not 1 or -1
| })
userId_hashed
indexpoc> 
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { userId: 'hashed' }, name: 'userId_hashed' }
]
indexpoc> 

*3: Query Test*
indexpoc> db.users.find({
|     userId: 5000
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { userId: { '$eq': 5000 } },
    indexFilterSet: false,
    queryHash: '69BEE08A',
    planCacheShapeHash: '69BEE08A',
    planCacheKey: 'FCA78324',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      filter: { userId: { '$eq': 5000 } },
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { userId: 'hashed' },
        indexName: 'userId_hashed',
        isMultiKey: false,
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { userId: [ '[1116821492014799671, 1116821492014799671]' ] }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 1,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      filter: { userId: { '$eq': 5000 } },
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { userId: 'hashed' },
        indexName: 'userId_hashed',
        isMultiKey: false,
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { userId: [ '[1116821492014799671, 1116821492014799671]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'E4776CD650FE95C37B9037A6A9C739C922242981EF2369541745B58B5F5F4849',
  command: { find: 'users', filter: { userId: 5000 }, '$db': 'indexpoc' },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}

# Why Hash?
Without Hashing (Ranged Distribution):

Shard 1 → userId: 1 to 10000    ← Most traffic goes here ❌
Shard 2 → userId: 10001 to 20000 ← Less traffic
Shard 3 → userId: 20001 to 30000 ← Least traffic

Problem: Uneven distribution!

With Hashing (Random Distribution):

Shard 1 → userId: 918273, 555111, 123987  ← Random ✅
Shard 2 → userId: 444999, 888777, 111222  ← Random ✅
Shard 3 → userId: 333444, 666555, 999888  ← Random ✅

Result: Balanced load across all shards! 🎯

# Key Takeaway:                                                                                         -->*important notes*
Hashed indexes = ONLY for equality queries!

✅ Works: =, $in
❌ Doesn't work: $gt, $lt, $gte, $lte, $ne

*Terminal logs for works and Doesn't hashed index*
indexpoc> db.users.find({ userId: 5000 })                                                               -->*its doing indexes*
[ { _id: ObjectId('6a3a598ef437a123b8d1bb66'), userId: 5000 } ]
indexpoc> db.users.find({ userId: { $gt: 100 } })                                                       -->*its doing coll*
[
  { _id: ObjectId('6a3a598bf437a123b8d1a843'), userId: 101 },
  { _id: ObjectId('6a3a598bf437a123b8d1a844'), userId: 102 },
  { _id: ObjectId('6a3a598bf437a123b8d1a845'), userId: 103 },
  { _id: ObjectId('6a3a598bf437a123b8d1a846'), userId: 104 },
  { _id: ObjectId('6a3a598bf437a123b8d1a847'), userId: 105 },
  { _id: ObjectId('6a3a598bf437a123b8d1a848'), userId: 106 },
  { _id: ObjectId('6a3a598bf437a123b8d1a849'), userId: 107 },
  { _id: ObjectId('6a3a598bf437a123b8d1a84a'), userId: 108 },
  { _id: ObjectId('6a3a598bf437a123b8d1a84b'), userId: 109 },
  { _id: ObjectId('6a3a598bf437a123b8d1a84c'), userId: 110 },
  { _id: ObjectId('6a3a598bf437a123b8d1a84d'), userId: 111 },
  { _id: ObjectId('6a3a598bf437a123b8d1a84e'), userId: 112 },
  { _id: ObjectId('6a3a598bf437a123b8d1a84f'), userId: 113 },
  { _id: ObjectId('6a3a598bf437a123b8d1a850'), userId: 114 },
  { _id: ObjectId('6a3a598bf437a123b8d1a851'), userId: 115 },
  { _id: ObjectId('6a3a598bf437a123b8d1a852'), userId: 116 },
  { _id: ObjectId('6a3a598bf437a123b8d1a853'), userId: 117 },
  { _id: ObjectId('6a3a598bf437a123b8d1a854'), userId: 118 },
  { _id: ObjectId('6a3a598bf437a123b8d1a855'), userId: 119 },
  { _id: ObjectId('6a3a598bf437a123b8d1a856'), userId: 120 }
]
Type "it" for more
indexpoc> db.users.find({
|     userId: { $in: [1, 100, 5000] }
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { userId: { '$in': [ 1, 100, 5000 ] } },
    indexFilterSet: false,
    queryHash: '1E2782CF',
    planCacheShapeHash: '1E2782CF',
    planCacheKey: '7D6E90B1',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      filter: { userId: { '$in': [ 1, 100, 5000 ] } },
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { userId: 'hashed' },
        indexName: 'userId_hashed',
        isMultiKey: false,
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          userId: [
            '[-5582987830488433087, -5582987830488433087]',
            '[1116821492014799671, 1116821492014799671]',
            '[5902408780260971510, 5902408780260971510]'
          ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 3,
    executionTimeMillis: 0,
    totalKeysExamined: 6,
    totalDocsExamined: 3,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      filter: { userId: { '$in': [ 1, 100, 5000 ] } },
      nReturned: 3,
      executionTimeMillisEstimate: 0,
      works: 6,
      advanced: 3,
      needTime: 2,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 3,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 3,
        executionTimeMillisEstimate: 0,
        works: 6,
        advanced: 3,
        needTime: 2,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { userId: 'hashed' },
        indexName: 'userId_hashed',
        isMultiKey: false,
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          userId: [
            '[-5582987830488433087, -5582987830488433087]',
            '[1116821492014799671, 1116821492014799671]',
            '[5902408780260971510, 5902408780260971510]'
          ]
        },
        keysExamined: 6,
        seeks: 3,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'D7504EB21DD668CCE5E68C73BAC8BAE1610211306A8983BA7490EE552B87342C',
  command: {
    find: 'users',
    filter: { userId: { '$in': [ 1, 100, 5000 ] } },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> db.users.find({ userId: { $gt: 100 } }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { userId: { '$gt': 100 } },
    indexFilterSet: false,
    queryHash: 'A248A23D',
    planCacheShapeHash: 'A248A23D',
    planCacheKey: '2509CB66',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { userId: { '$gt': 100 } },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 9900,
    executionTimeMillis: 7,
    totalKeysExamined: 0,
    totalDocsExamined: 10000,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { userId: { '$gt': 100 } },
      nReturned: 9900,
      executionTimeMillisEstimate: 0,
      works: 10001,
      advanced: 9900,
      needTime: 100,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 10000
    }
  },
  queryShapeHash: '68DC10F05CA0EE99B5FFA8AE8A9030B9F369C9EABB9268F709568D1C3AE0A90A',
  command: {
    find: 'users',
    filter: { userId: { '$gt': 100 } },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: 'c0d078d5baca',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

*Summary:-*
Feature	                              Hashed Index
-----------------------------         ------------
Equality { userId: 5000 }	          ✅ IXSCAN
Range { userId: { $gt: 100 } }	      ❌ COLLSCAN
IN { userId: { $in: [1,2,3] } }	      ✅ IXSCAN

# Senior Interview Answer
Why use hashed index if range queries don't work?
Answer:
Hashed indexes are primarily designed for hashed sharding.
They convert shard keys into evenly distributed hash values, preventing hot shards and balancing data across cluster nodes.
They *support equality lookups efficiently* but are unsuitable for range queries because hashing destroys natural ordering.



## Wildcard Index:
--------------------------------------------------
# Imagine a document:
{
   name:"John",
   profile:{
      city:"Chennai",
      country:"India",
      skill:"Node"
   }
}
# Tomorrow:
{
   name:"David",
   profile:{
      city:"Mumbai",
      department:"IT"
   }
}
# Tomorrow:
{
   name:"Mike",
   profile:{
      technology:"React"
   }
}
*Fields keep changing.*                                                                             -->*important line*
*You don't know which fields to index.*

# Wildcard Index terminal log:
indexpoc> db.users.drop()
true
indexpoc> db.users.insertMany([
| {
|     name:"John",
|     profile:{
|         city:"Chennai",
|         skill:"Node"
|     }
| },
| {
|     name:"David",
|     profile:{
|         city:"Mumbai",
|         department:"IT"
|     }
| },
| {
|     name:"Mike",
|     profile:{
|         technology:"React"
|     }
| }
| ])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6a3a60fa7d0241714bd1a7bb'),
    '1': ObjectId('6a3a60fa7d0241714bd1a7bc'),
    '2': ObjectId('6a3a60fa7d0241714bd1a7bd')
  }
}
indexpoc> db.users.createIndex({
|    "profile.$**":1                                                                    -->*Notice* : Index every field, inside profile
| })
profile.$**_1
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { 'profile.$**': 1 }, name: 'profile.$**_1' }
]
indexpoc> 
*create indexes for all field inside the profile*
logs:-
indexpoc> db.users.find({
|    "profile.city":"Chennai"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { 'profile.city': { '$eq': 'Chennai' } },
    indexFilterSet: false,
    queryHash: '1318EC58',
    planCacheShapeHash: '1318EC58',
    planCacheKey: '120DF9F7',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { '$_path': 1, 'profile.city': 1 },
        indexName: 'profile.$**_1',
        isMultiKey: false,
        multiKeyPaths: { '$_path': [], 'profile.city': [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          '$_path': [ '["profile.city", "profile.city"]' ],
          'profile.city': [ '["Chennai", "Chennai"]' ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 2,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { '$_path': 1, 'profile.city': 1 },
        indexName: 'profile.$**_1',
        isMultiKey: false,
        multiKeyPaths: { '$_path': [], 'profile.city': [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          '$_path': [ '["profile.city", "profile.city"]' ],
          'profile.city': [ '["Chennai", "Chennai"]' ]
        },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '773FC72334CD6E39FA3B73B8D965128B92F8A38BB6FF309C519AA6BE851D2FDE',
  command: {
    find: 'users',
    filter: { 'profile.city': 'Chennai' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: '2d29da6dbb3f',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> db.users.find({
|    "profile.skill":"Node"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { 'profile.skill': { '$eq': 'Node' } },
    indexFilterSet: false,
    queryHash: '71DC4929',
    planCacheShapeHash: '71DC4929',
    planCacheKey: '4E4F5D9E',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { '$_path': 1, 'profile.skill': 1 },
        indexName: 'profile.$**_1',
        isMultiKey: false,
        multiKeyPaths: { '$_path': [], 'profile.skill': [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          '$_path': [ '["profile.skill", "profile.skill"]' ],
          'profile.skill': [ '["Node", "Node"]' ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 0,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { '$_path': 1, 'profile.skill': 1 },
        indexName: 'profile.$**_1',
        isMultiKey: false,
        multiKeyPaths: { '$_path': [], 'profile.skill': [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          '$_path': [ '["profile.skill", "profile.skill"]' ],
          'profile.skill': [ '["Node", "Node"]' ]
        },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'B73B7D51B34F91CDD1D02008E0B5C7AF441F2D9FD78AD31FCB2E95377A10EC40',
  command: {
    find: 'users',
    filter: { 'profile.skill': 'Node' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: '2d29da6dbb3f',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> db.users.find({
|    "profile.department":"IT"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { 'profile.department': { '$eq': 'IT' } },
    indexFilterSet: false,
    queryHash: 'FC4479E0',
    planCacheShapeHash: 'FC4479E0',
    planCacheKey: 'A9F517A6',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { '$_path': 1, 'profile.department': 1 },
        indexName: 'profile.$**_1',
        isMultiKey: false,
        multiKeyPaths: { '$_path': [], 'profile.department': [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          '$_path': [ '["profile.department", "profile.department"]' ],
          'profile.department': [ '["IT", "IT"]' ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 0,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { '$_path': 1, 'profile.department': 1 },
        indexName: 'profile.$**_1',
        isMultiKey: false,
        multiKeyPaths: { '$_path': [], 'profile.department': [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          '$_path': [ '["profile.department", "profile.department"]' ],
          'profile.department': [ '["IT", "IT"]' ]
        },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '9F045CBC5FE738A3A8E3C1740A4C4BDE6BDBC1B9B5AC19948DEC8A09A8F32FDE',
  command: {
    find: 'users',
    filter: { 'profile.department': 'IT' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: '2d29da6dbb3f',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}

# Why Use It?
Suppose:
{
    customFields:{
       anyField1:"",
       anyField2:"",
       anyField3:""
    }
}
User-defined fields.
You don't know field names beforehand.
Wildcard index helps.

# Downside
Indexes many fields.
Consumes more:-
Storage
Memory
Write Cost

# Interview Question
Wildcard Index is best for?
Answer:
Dynamic schemas
Unknown fields
User-generated attributes



## Hidden Index:
----------------------------------------------
*Real Production Usage*
Before deleting index:-
- Hide
- Observe
- Check slow queries
- Delete later
Safer.

# Interview Question
Hidden Index means?
Index exists physically
but query planner ignores it.

*Terminal logs with unhide and hide index changing IXSCAN to COLLSCAN and COLLSCAN to IXSCAN*:
indexpoc> db.users.drop()
true
indexpoc> for(let i=0;i<100000;i++){
| 
|     db.users.insertOne({
|         email:`user${i}@gmail.com`
|     })
| 
| }
{
  acknowledged: true,
  insertedId: ObjectId('6a3a63167d0241714bd32e5d')
}
indexpoc> db.users.createIndex({
|    email:1
| })
email_1
indexpoc> db.users.find({
|    email:"user99999@gmail.com"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'user99999@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'F713C797',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ] }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 2,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'user99999@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: '2d29da6dbb3f',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' }
]
indexpoc> db.users.hideIndex(
|    "email_1"
| )
{ hidden_old: false, hidden_new: true, ok: 1 }
indexpoc> db.users.find({
|    email:"user99999@gmail.com"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'user99999@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'F713C797',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { email: { '$eq': 'user99999@gmail.com' } },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 49,
    totalKeysExamined: 0,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { email: { '$eq': 'user99999@gmail.com' } },
      nReturned: 1,
      executionTimeMillisEstimate: 43,
      works: 100001,
      advanced: 1,
      needTime: 99999,
      needYield: 0,
      saveState: 3,
      restoreState: 3,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 100000
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'user99999@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: '2d29da6dbb3f',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> db.users.unhideIndex(
|    "email_1"
| )
{ hidden_old: true, hidden_new: false, ok: 1 }
indexpoc> db.users.find({
|    email:"user99999@gmail.com"
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'user99999@gmail.com' } },
    indexFilterSet: false,
    queryHash: '2C2F10E4',
    planCacheShapeHash: '2C2F10E4',
    planCacheKey: 'F713C797',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ] }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 0,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1 },
        indexName: 'email_1',
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: { email: [ '["user99999@gmail.com", "user99999@gmail.com"]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'BD9BD9CB373AF82BF402CDEE851E156C78CCEDEC81709BB12E9C901495407895',
  command: {
    find: 'users',
    filter: { email: 'user99999@gmail.com' },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: '2d29da6dbb3f',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 
*This for if you think: Maybe this index is unnecessary we can hide without drop, if drop: Production may become slow.*



## Case-Insensitive Index:
---------------------------------------------------
# Problem

User searches:
john@gmail.com

Database stores:
John@gmail.com

- Normal index fails.

*Terminal log of creating Case-insensitive index:*
indexpoc> db.users.drop()
true
indexpoc> db.users.insertOne({
|    email:"John@gmail.com"
| })
{
  acknowledged: true,
  insertedId: ObjectId('6a3a644a7d0241714bd32e5e')
}
indexpoc> db.users.createIndex(
| {
|    email:1
| },
| {
|    collation:{
|       locale:"en",
|       strength:2
|    }
| }
| )
email_1
indexpoc> 

# What Is strength?
1 = ignore case + accents
2 = ignore case
3 = case sensitive

For interviews remember:
strength:2

*Log:*
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  {
    v: 2,
    key: { email: 1 },
    name: 'email_1',
    collation: {
      locale: 'en',
      caseLevel: false,
      caseFirst: 'off',
      strength: 2,
      numericOrdering: false,
      alternate: 'non-ignorable',
      maxVariable: 'punct',
      normalization: false,
      backwards: false,
      version: '57.1'
    }
  }
]
indexpoc> 

*We have to search with collation without it will be case sensitive no result*:
indexpoc> db.users.find({
|    email:"john@gmail.com"
| })

*with collection it will ignore case*:
indexpoc> db.users.find({
|    email:"john@gmail.com"
| })
| .collation({
|    locale:"en",
|    strength:2
| })
| .explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { email: { '$eq': 'john@gmail.com' } },
    collation: {
      locale: 'en',
      caseLevel: false,
      caseFirst: 'off',
      strength: 2,
      numericOrdering: false,
      alternate: 'non-ignorable',
      maxVariable: 'punct',
      normalization: false,
      backwards: false,
      version: '57.1'
    },
    indexFilterSet: false,
    queryHash: '622D3F9A',
    planCacheShapeHash: '622D3F9A',
    planCacheKey: 'A7D78B42',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { email: 1 },
        indexName: 'email_1',
        collation: {
          locale: 'en',
          caseLevel: false,
          caseFirst: 'off',
          strength: 2,
          numericOrdering: false,
          alternate: 'non-ignorable',
          maxVariable: 'punct',
          normalization: false,
          backwards: false,
          version: '57.1'
        },
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [
            '[CollationKey(0x3b4537430a7a354129393f082d45410112), CollationKey(0x3b4537430a7a354129393f082d45410112)]'
          ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 1,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      nReturned: 1,
      executionTimeMillisEstimate: 0,
      works: 2,
      advanced: 1,
      needTime: 0,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 1,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 1,
        executionTimeMillisEstimate: 0,
        works: 2,
        advanced: 1,
        needTime: 0,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { email: 1 },
        indexName: 'email_1',
        collation: {
          locale: 'en',
          caseLevel: false,
          caseFirst: 'off',
          strength: 2,
          numericOrdering: false,
          alternate: 'non-ignorable',
          maxVariable: 'punct',
          normalization: false,
          backwards: false,
          version: '57.1'
        },
        isMultiKey: false,
        multiKeyPaths: { email: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          email: [
            '[CollationKey(0x3b4537430a7a354129393f082d45410112), CollationKey(0x3b4537430a7a354129393f082d45410112)]'
          ]
        },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '384EE4B570F9CF101AA80B84AE3A66431ED853141A1E667007200BB9E9160BA6',
  command: {
    find: 'users',
    filter: { email: 'john@gmail.com' },
    collation: { locale: 'en', strength: 2 },
    '$db': 'indexpoc'
  },
  serverInfo: {
    host: '2d29da6dbb3f',
    port: 27017,
    version: '8.2.11',
    gitVersion: 'ee01d36638a00a07a6aa42ee80a125890f11aeed'
  },
  serverParameters: {
    internalQueryFacetBufferSizeBytes: 104857600,
    internalQueryFacetMaxOutputDocSizeBytes: 104857600,
    internalLookupStageIntermediateDocumentMaxSizeBytes: 104857600,
    internalDocumentSourceGroupMaxMemoryBytes: 104857600,
    internalQueryMaxBlockingSortMemoryUsageBytes: 104857600,
    internalQueryProhibitBlockingMergeOnMongoS: 0,
    internalQueryMaxAddToSetBytes: 104857600,
    internalDocumentSourceSetWindowFieldsMaxMemoryBytes: 104857600,
    internalQueryFrameworkControl: 'trySbeRestricted',
    internalQueryPlannerIgnoreIndexWithCollationForRegex: 1
  },
  ok: 1
}
indexpoc> 

# Comparison
Index	                   Purpose
Wildcard	        Index unknown/dynamic fields
Hidden	            Test index removal safely
Case-Insensitive	Ignore letter casing

