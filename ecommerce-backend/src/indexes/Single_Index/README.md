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



# hashed index properly:
-------------------------------------------
## Sharding:
┌──────────────────────────────────────────────────────┐
│                   Sharded Cluster                     │
│                                                       │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│  │   Shard 1     │  │   Shard 2     │  │   Shard 3     │
│  │               │  │               │  │               │
│  │ Doc1          │  │ Doc3          │  │ Doc5          │
│  │ Doc2          │  │ Doc4          │  │ Doc6          │
│  │               │  │               │  │               │
│  │ DIFFERENT     │  │ DIFFERENT     │  │ DIFFERENT     │
│  │ DATA          │  │ DATA          │  │ DATA          │
│  └───────────────┘  └───────────────┘  └───────────────┘
│                                                       │
│  Each shard holds DIFFERENT subset of data            │
│  Purpose: Horizontal Scaling + Performance            │
└──────────────────────────────────────────────────────┘

## replica:
┌─────────────────────────────────────────┐
│              Replica Set                 │
│                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  │ PRIMARY  │  │SECONDARY │  │SECONDARY │
│  │          │  │          │  │          │
│  │ Doc1     │  │ Doc1     │  │ Doc1     │
│  │ Doc2     │  │ Doc2     │  │ Doc2     │
│  │ Doc3     │  │ Doc3     │  │ Doc3     │
│  │ Doc4     │  │ Doc4     │  │ Doc4     │
│  │ ALL DATA │  │ ALL DATA │  │ ALL DATA │
│  └──────────┘  └──────────┘  └──────────┘
│                                          │
│  SAME DATA everywhere                    │
│  Purpose: High Availability + Failover   │
└─────────────────────────────────────────┘

## Visual Side-by-Side:
     REPLICATION (Same Data Everywhere)                   SHARDING (Different Data)
        
   Primary          Secondary-1  Secondary-2              Shard-1    Shard-2    Shard-3
 ┌──────────┐     ┌──────────┐  ┌──────────┐           ┌────────┐ ┌────────┐ ┌────────┐
 │ A B C D  │     │ A B C D  │  │ A B C D  │           │ A  B   │ │ C  D   │ │ E  F   │
 │ E F G H  │     │ E F G H  │  │ E F G H  │           │ G      │ │ H  I   │ │ J  K   │
 │ I J K L  │     │ I J K L  │  │ I J K L  │           │        │ │        │ │ L      │
 │          │     │          │  │          │           │        │ │        │ │        │
 │ 12 docs  │     │ 12 docs  │  │ 12 docs  │           │ 4 docs │ │ 4 docs │ │ 4 docs │
 └──────────┘     └──────────┘  └──────────┘           └────────┘ └────────┘ └────────┘
         
 If Primary dies:                                       If Shard-2 dies:
 Secondary takes over                                   Data C,D,H,I is LOST
 (no data loss)                                         (need replica set per shard)

 ### Production Architecture (Combined):
 ┌────────────────────────────────────────────────────────────────┐
│                       Sharded Cluster                          │
│                                                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  │   Shard 1        │  │   Shard 2        │  │   Shard 3        │
│  │  (Replica Set)   │  │  (Replica Set)   │  │  (Replica Set)   │
│  │                  │  │                  │  │                  │
│  │ Primary Sec1 Sec2│  │ Primary Sec1 Sec2│  │ Primary Sec1 Sec2│
│  │ ┌────┐ ┌───┐ ┌──┐│  │ ┌────┐ ┌───┐ ┌──┐│  │ ┌────┐ ┌───┐ ┌──┐│
│  │ │A B │ │A B│ │AB││  │ │C D │ │C D│ │CD││  │ │E F │ │E F│ │EF││
│  │ │G   │ │G  │ │G ││  │ │H I │ │H I│ │HI││  │ │J K │ │J K│ │JK││
│  │ │    │ │   │ │  ││  │ │    │ │   │ │  ││  │ │L   │ │L  │ │L ││
│  │ └────┘ └───┘ └──┘│  │ └────┘ └───┘ └──┘│  │ └────┘ └───┘ └──┘│
│  └──────────────────┘  └──────────────────┘  └──────────────────┘
│                                                                │
│  Each Shard = Replica Set (HA for that shard's data)          │
│  Each Shard holds DIFFERENT data (scaling)                    │
└────────────────────────────────────────────────────────────────┘

Interview Answer:-

Q: Sharding vs Replication?
A: Replication = Same data everywhere (HA + failover)
   Sharding = Different data per shard (scaling)
   
Q: Do they combine?
A: Yes! Each shard SHOULD be a replica set

Q: What happens if shard dies without replica?
A: That portion of data is LOST

Q: What happens if primary dies in replica set?
A: Secondary auto-promotes, no data loss

### Hashed Index Deep Dive
1. Why Hashed Index Exists
The Sharding Problem
javascript
// Regular index on email for sharding
sh.shardCollection("indexpoc.users", { email: 1 })

// What happens:
// user1@gmail.com → Shard A
// user2@gmail.com → Shard B
// user3@gmail.com → Shard C
// ...
// user999999@gmail.com → Same shard as similar emails?

Problem with regular index for sharding:
// Emails are sequential/similar
"aaron@gmail.com"     → Shard 1
"aaron1@gmail.com"    → Shard 1 (nearby in sort order)
"aaron2@gmail.com"    → Shard 1
"abraham@gmail.com"   → Shard 1

// User IDs (ObjectId) are time-based
ObjectId("507f1f77bcf86cd799439011")  // All from same second → Shard 1
ObjectId("507f1f77bcf86cd799439012")  // Same shard
ObjectId("507f1f77bcf86cd799439013")  // Same shard

Result: Hot shard

Shard 1: 80% data  (all new users go here)
Shard 2: 10% data
Shard 3: 10% data

### Hashed Index Fix:
sh.shardCollection("indexpoc.users", { email: "hashed" })

// Hash function distributes randomly
"aaron@gmail.com"     → Hash: 783462891 → Shard 2
"aaron1@gmail.com"    → Hash: 125674389 → Shard 3
"aaron2@gmail.com"    → Hash: 987654321 → Shard 1
"abraham@gmail.com"   → Hash: 456789123 → Shard 3

// Even distribution
Shard 1: 33%
Shard 2: 33%
Shard 3: 33%

2. How MongoDB Stores Hashed Index
*Regular B-Tree Index:-*
db.users.createIndex({ email: 1 })

// B-Tree structure (sorted alphabetically):
          [m]
         /   \
    [a-l]       [n-z]
    /    \     /      \
[a-f] [g-l]   [n-s]   [t-z]
  |      |       |        |
"aaron" "mike" "nancy" "zack"
"bob"   "mongo" "oscar" "zoe"

*Hashed Index (Same B-Tree, Different Keys):-*
db.users.createIndex({ email: "hashed" })

// MongoDB does internally:
// 1. Takes email: "aaron@gmail.com"
// 2. Applies hash function: hash("aaron@gmail.com") → 783462891
// 3. Stores 783462891 in B-Tree instead of "aaron@gmail.com"

// B-Tree structure (sorted by hash NUMBER):
              [500000000]
             /           \
    [100000000-499M]     [500M-999999999]
         /        \           /         \
   [100M-299M] [300M-499M] [500M-749M]  [750M-999M]
       |            |           |           |
   125674389    456789123   783462891   987654321
   (aaron1)     (abraham)   (aaron)    (aaron2)
Same B-Tree, different sort order!

### 3. Why Equality Works
*Query Execution:*
db.users.find({ email: "aaron@gmail.com" })

// Step 1: MongoDB hashes the query value
hash("aaron@gmail.com") → 783462891

// Step 2: B-Tree lookup (same as regular index)
Search tree for 783462891:
  Check root: 500000000
  783462891 > 500000000 → Go right
  Check node: 500M-999M
  Check: 750M-999M
  783462891 is here → Found in O(log n)

// Step 3: Get document pointer
Index entry: { 783462891 → ObjectId("...") }

// Step 4: Fetch document

*Explain Output*
db.users.find({ email: "aaron@gmail.com" }).explain("executionStats")

{
  executionStats: {
    stage: "IXSCAN",              // ✅ Same as regular index
    indexName: "email_hashed",
    totalKeysExamined: 1,         // ✅ O(log n) lookup
    totalDocsExamined: 1          // ✅ Single document
  }
}
Equality = Exact hash match = B-Tree works perfectly

### Terminal logs:
test> use indexpoc
switched to db indexpoc
indexpoc> db.users.drop()
true
indexpoc> for(let i=1;i<=100000;i++){
| 
|     db.users.insertOne({
|         userId:i,
|         name:`User${i}`
|     })
| 
| }
{
  acknowledged: true,
  insertedId: ObjectId('6a3cb57f74a230a9ccd32e5a')
}
indexpoc> db.users.findOne()
{ _id: ObjectId('6a3cb55574a230a9ccd1a7bb'), userId: 1, name: 'User1' }
indexpoc> db.users.find({
|     userId:50000
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { userId: { '$eq': 50000 } },
    indexFilterSet: false,
    queryHash: '69BEE08A',
    planCacheShapeHash: '69BEE08A',
    planCacheKey: 'E3E2F96D',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { userId: { '$eq': 50000 } },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 1,
    executionTimeMillis: 41,
    totalKeysExamined: 0,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { userId: { '$eq': 50000 } },
      nReturned: 1,
      executionTimeMillisEstimate: 39,
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
  queryShapeHash: 'E4776CD650FE95C37B9037A6A9C739C922242981EF2369541745B58B5F5F4849',
  command: { find: 'users', filter: { userId: 50000 }, '$db': 'indexpoc' },
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
indexpoc> db.users.createIndex({
|     userId:"hashed"
| })
userId_hashed
indexpoc> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { userId: 'hashed' }, name: 'userId_hashed' }
]
indexpoc> db.users.find({
|     userId:50000
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { userId: { '$eq': 50000 } },
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
      filter: { userId: { '$eq': 50000 } },
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
        indexBounds: { userId: [ '[1009823700664732862, 1009823700664732862]' ] }
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
      filter: { userId: { '$eq': 50000 } },
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
        indexBounds: { userId: [ '[1009823700664732862, 1009823700664732862]' ] },
        keysExamined: 1,
        seeks: 1,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: 'E4776CD650FE95C37B9037A6A9C739C922242981EF2369541745B58B5F5F4849',
  command: { find: 'users', filter: { userId: 50000 }, '$db': 'indexpoc' },
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

### What Actually Happens?

You search:
{
   userId:50000
}

Mongo internally:
50000
 ↓
Hash Function
 ↓
879126731
 ↓
Index Search
 ↓
Document

* You never see the hash.
* Mongo computes it automatically.

Important

### Mongo is NOT storing:
1
2
3
4
5
inside index.

It stores:
88772
11223
99881
44556
...
(Hash values)
* Not actual values.

## Terminal log for Test range query:
indexpoc> db.users.find({
|    userId:{
|       $gt:50000
|    }
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'indexpoc.users',
    parsedQuery: { userId: { '$gt': 50000 } },
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
      filter: { userId: { '$gt': 50000 } },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 50000,
    executionTimeMillis: 43,
    totalKeysExamined: 0,
    totalDocsExamined: 100000,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: { userId: { '$gt': 50000 } },
      nReturned: 50000,
      executionTimeMillisEstimate: 21,
      works: 100001,
      advanced: 50000,
      needTime: 50000,
      needYield: 0,
      saveState: 2,
      restoreState: 2,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 100000
    }
  },
  queryShapeHash: '68DC10F05CA0EE99B5FFA8AE8A9030B9F369C9EABB9268F709568D1C3AE0A90A',
  command: {
    find: 'users',
    filter: { userId: { '$gt': 50000 } },
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

### Why It Performs Poorly
Normal B-Tree Index:
1
2
3
4
5
6
7
8

Mongo can jump:
    Start at 50001
    Continue forward
* Efficient.

Hashed Index:
1 -> 88772
2 -> 11223
3 -> 99881
4 -> 44556
5 -> 22119
* Now ordering is gone.

Mongo cannot do:
50001
50002
50003
* because hashes are random.

### Expected explain:
You may see:
COLLSCAN
or
IXSCAN + FETCH
* with many examined documents.
* Depends on version.

### Interview Question:-
Which query benefits?
{
   userId:5000
}
✅ Good
{
   userId:{
      $in:[1,2,3,4]
   }
}
✅ Usually Good
{
   userId:{
      $gt:5000
   }
}
❌ Bad
.sort({
   userId:1
})
❌ Bad

### Why Sharding Loves Hashed Index:-
Without hash:
Shard1 -> 1 to 300000
Shard2 -> 300001 to 600000
Shard3 -> 600001 to 1000000

New users:
1000001
1000002
1000003

always go to:
Shard3
* Hot shard.

With hashed shard key:
1000001 -> random
1000002 -> random
1000003 -> random

Distribution:
Shard1 : 33%
Shard2 : 33%
Shard3 : 34%
* Balanced.

### Senior-Level Takeaway:-
Hashed Index is not a query optimization index first.

Think of it as:
Single Index      -> Fast lookups
Compound Index    -> Filter + Sort
Text Index        -> Search
TTL Index         -> Auto delete
Unique Index      -> Data integrity
Hashed Index      -> Even data distribution for sharding


# Word Sharding:
-----------------
## What is a Cluster?
A cluster is simply:
Multiple servers working together
as one database system

### Instead of:
MongoDB
  |
Server-1

### You have:
MongoDB Cluster
    |
Server-1
Server-2
Server-3

Applications see:
mongodb://cluster-url
* not individual servers.

### Why Not One Server?
Suppose:
10 million users
500 GB data
10,000 requests/sec

One server may eventually hit:
CPU limit
RAM limit
Disk limit
Network limit
* Then you need multiple servers.

### MongoDB Has Two Different Scaling Concepts:
Many people confuse these.
1. Replica Set
Purpose:
 - High Availability
Example:
Primary
  |
Secondary
  |
Secondary
Writes:-
App
 ↓
Primary
* Only primary accepts writes.
Replication:-
Primary
 ↓
Secondary
 ↓
Secondary
* Data copied.

## If Primary Dies:
Mongo elects another primary.
Old Primary ❌
Secondary-1 becomes Primary ✅
Application continues.

## Replica Set Solves
✅ High availability
✅ Disaster recovery
✅ Read scaling

## Replica Set Does NOT Solve
❌ Huge storage
❌ Huge write traffic
Because every server still contains:
All Data

2. Sharding
Purpose:
Horizontal Scaling

Instead of:
 - Server1
 - 1 million users
 - You split data.

Shard1
Users
1 - 300k

Shard2
Users
300k - 600k
Shard3

Users
600k - 1m

Now storage becomes:
Shard1 = 100 GB
Shard2 = 100 GB
Shard3 = 100 GB

instead of:
One server = 300 GB

What Does Sharding Solve?
✅ More storage
✅ More write throughput
✅ More read throughput
✅ Bigger datasets

#### Real Mongo Cluster
Production cluster:

                Router (mongos)
                     |
      -----------------------------
      |             |            |
   Shard1        Shard2       Shard3
      |             |            |
 Replica Set    Replica Set   Replica Set

Notice:-
Shard
   +
Replica Set
* Usually both.

Example:-
Let's say:
Instagram

has:
2 billion users
* One machine cannot hold everything.
* Mongo splits users.

Shard1 -> Some users
Shard2 -> Some users
Shard3 -> Some users

Each shard may itself contain:
Primary
Secondary
Secondary
* for reliability.

#### Where Does Hashed Index Come In?
Suppose shard key:
{
   userId: 1
}

New users:
1000001
1000002
1000003
* keep going to last shard.
* Bad.

Mongo uses:
{
   userId: "hashed"
}

Now:
1000001 -> random shard
1000002 -> random shard
1000003 -> random shard
* Balanced.


# Sharding and replica test terminal logs:
------------------------------------------
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker compose down -v
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/ecommerce-backend/docker-compose.yaml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 7/7
 ✔ Container ecommerce-backend-mongos-1      Removed                                                                                 0.0s 
 ✔ Container ecommerce-backend-shard2b-1     Removed                                                                                 0.4s 
 ✔ Container ecommerce-backend-shard1a-1     Removed                                                                                 0.4s 
 ✔ Container ecommerce-backend-shard1b-1     Removed                                                                                 0.4s 
 ✔ Container ecommerce-backend-configsvr1-1  Removed                                                                                 0.3s 
 ✔ Container ecommerce-backend-shard2a-1     Removed                                                                                 0.3s 
 ! Network ecommerce-backend_default         Resource is still in use                                                                0.0s 
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker rm -f $(docker ps -aq)
dd32a54c1e9e
2d29da6dbb3f
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker compose down -v       
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/ecommerce-backend/docker-compose.yaml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 1/1
 ✔ Network ecommerce-backend_default  Removed                                                                                        0.2s 
keerthana@Keerthanas-MacBook-Air ecommerce-backend % docker-compose up -d         
WARN[0000] /Users/keerthana/Desktop/MongoDB_Aggregation_Operators/ecommerce-backend/docker-compose.yaml: the attribute `version` is obsolete, it will be ignored, please remove it to avoid potential confusion 
[+] Running 7/7
 ✔ Network ecommerce-backend_default         Created                                                                                 0.0s 
 ✔ Container ecommerce-backend-shard1b-1     Started                                                                                 0.5s 
 ✔ Container ecommerce-backend-shard1a-1     Started                                                                                 0.5s 
 ✔ Container ecommerce-backend-configsvr1-1  Started                                                                                 0.5s 
 ✔ Container ecommerce-backend-shard2b-1     Started                                                                                 0.5s 
 ✔ Container ecommerce-backend-shard2a-1     Started                                                                                 0.5s 
 ✔ Container ecommerce-backend-mongos-1      Started                                                                                 0.5s 
keerthana@Keerthanas-MacBook-Air ecommerce-backend % sleep 30
keerthana@Keerthanas-MacBook-Air ecommerce-backend % chmod +x setup.sh
./setup.sh
Waiting for containers...
{ ok: 1 }
{ ok: 1 }
{ ok: 1 }
{
  shardAdded: 'shard2ReplSet',
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782367071, i: 20 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782367071, i: 10 })
}
✅ Cluster Ready! Connect: mongosh --port 27017

## error stage:
keerthana@Keerthanas-MacBook-Air indexes % mongosh --port 27017
zsh: command not found: mongosh
### resolve:
Step 1: Install mongosh (Mac)
bash
# Install via Homebrew
brew install mongosh
# Verify
mongosh --version

## after install connected mongosh terminal logs:
keerthana@Keerthanas-MacBook-Air indexes % mongosh --port 27017
Current Mongosh Log ID: 6a3cc5fa28468e78217bc0dd
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          7.0.37
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2026-06-25T05:56:31.149+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
------

[direct: mongos] test> sh.status()
shardingVersion
{ _id: 1, clusterId: ObjectId('6a3cc34ddd9fa1ef53a3cf85') }
---
shards
[
  {
    _id: 'shard1ReplSet',
    host: 'shard1ReplSet/shard1a:27018,shard1b:27018',
    state: 1,
    topologyTime: Timestamp({ t: 1782367068, i: 8 })
  },
  {
    _id: 'shard2ReplSet',
    host: 'shard2ReplSet/shard2a:27018,shard2b:27018',
    state: 1,
    topologyTime: Timestamp({ t: 1782367071, i: 8 })
  }
]
---
active mongoses
[ { '7.0.37': 1 } ]
---
autosplit
{ 'Currently enabled': 'yes' }
---
balancer
{
  'Currently enabled': 'yes',
  'Currently running': 'no',
  'Failed balancer rounds in last 5 attempts': 0,
  'Migration Results for the last 24 hours': 'No recent migrations'
}
---
shardedDataDistribution
[
  {
    ns: 'indexpoc.users',
    shards: [
      {
        shardName: 'shard1ReplSet',
        numOrphanedDocs: 0,
        numOwnedDocuments: 5053,
        ownedSizeBytes: 444664,
        orphanedSizeBytes: 0
      },
      {
        shardName: 'shard2ReplSet',
        numOrphanedDocs: 0,
        numOwnedDocuments: 4947,
        ownedSizeBytes: 435336,
        orphanedSizeBytes: 0
      }
    ]
  },
  {
    ns: 'config.system.sessions',
    shards: [
      {
        shardName: 'shard1ReplSet',
        numOrphanedDocs: 0,
        numOwnedDocuments: 21,
        ownedSizeBytes: 2079,
        orphanedSizeBytes: 0
      }
    ]
  }
]
---
databases
[
  {
    database: { _id: 'config', primary: 'config', partitioned: true },
    collections: {
      'config.system.sessions': {
        shardKey: { _id: 1 },
        unique: false,
        balancing: true,
        allowMigrations: true,
        chunkMetadata: [ { shard: 'shard1ReplSet', nChunks: 1 } ],
        chunks: [
          { min: { _id: MinKey() }, max: { _id: MaxKey() }, 'on shard': 'shard1ReplSet', 'last modified': Timestamp({ t: 1, i: 0 }) }
        ],
        tags: []
      }
    }
  },
  {
    database: {
      _id: 'indexpoc',
      primary: 'shard2ReplSet',
      partitioned: false,
      version: {
        uuid: UUID('d1ccafc8-135c-4e93-84c8-f9fb18264f6b'),
        timestamp: Timestamp({ t: 1782367143, i: 1 }),
        lastMod: 1
      }
    },
    collections: {
      'indexpoc.users': {
        shardKey: { email: 'hashed' },
        unique: false,
        balancing: true,
        allowMigrations: true,
        chunkMetadata: [
          { shard: 'shard1ReplSet', nChunks: 2 },
          { shard: 'shard2ReplSet', nChunks: 2 }
        ],
        chunks: [
          { min: { email: MinKey() }, max: { email: Long('-4611686018427387902') }, 'on shard': 'shard2ReplSet', 'last modified': Timestamp({ t: 1, i: 0 }) },
          { min: { email: Long('-4611686018427387902') }, max: { email: Long('0') }, 'on shard': 'shard2ReplSet', 'last modified': Timestamp({ t: 1, i: 1 }) },
          { min: { email: Long('0') }, max: { email: Long('4611686018427387902') }, 'on shard': 'shard1ReplSet', 'last modified': Timestamp({ t: 1, i: 2 }) },
          { min: { email: Long('4611686018427387902') }, max: { email: MaxKey() }, 'on shard': 'shard1ReplSet', 'last modified': Timestamp({ t: 1, i: 3 }) }
        ],
        tags: []
      }
    }
  }
]
[direct: mongos] test> 

[direct: mongos] test> use indexpoc
switched to db indexpoc
[direct: mongos] indexpoc> db.users.getShardDistribution()
Shard shard2ReplSet at shard2ReplSet/shard2a:27018,shard2b:27018
{
  data: '428KiB',
  docs: 4947,
  chunks: 2,
  'estimated data per chunk': '214KiB',
  'estimated docs per chunk': 2473
}
---
Shard shard1ReplSet at shard1ReplSet/shard1a:27018,shard1b:27018
{
  data: '438KiB',
  docs: 5053,
  chunks: 2,
  'estimated data per chunk': '219KiB',
  'estimated docs per chunk': 2526
}
---
Totals
{
  data: '866KiB',
  docs: 10000,
  chunks: 4,
  'Shard shard2ReplSet': [
    '49.47 % data',
    '49.47 % docs in cluster',
    '88B avg obj size on shard'
  ],
  'Shard shard1ReplSet': [
    '50.52 % data',
    '50.53 % docs in cluster',
    '88B avg obj size on shard'
  ]
}
[direct: mongos] indexpoc> db.users.aggregate([
|   { $match: { email: "user5000@gmail.com" } },
|   { $project: { 
|       email: 1,
|       hashValue: { $toHashedIndexKey: "$email" }
|   }}
| ])
[
  {
    _id: ObjectId('6a3cc44af407a810591be31d'),
    email: 'user5000@gmail.com',
    hashValue: Long('7677552327051713248')                                       -->*This random number decides which shard*
  }
]
[direct: mongos] indexpoc> 
[direct: mongos] indexpoc> db.users.find({ email: "user5000@gmail.com" }).explain("executionStats")
{
  queryPlanner: {
    mongosPlannerVersion: 1,
    winningPlan: {
      stage: 'SINGLE_SHARD',
      shards: [
        {
          shardName: 'shard1ReplSet',
          connectionString: 'shard1ReplSet/shard1a:27018,shard1b:27018',
          serverInfo: {
            host: '5bb057d7a917',
            port: 27018,
            version: '7.0.37',
            gitVersion: '9d30419d900008ba3ecf2a14546b236f2158b65b'
          },
          namespace: 'indexpoc.users',
          indexFilterSet: false,
          parsedQuery: { email: { '$eq': 'user5000@gmail.com' } },
          queryHash: '7F1F8B58',
          planCacheKey: '34D9A51E',
          optimizationTimeMillis: 0,
          maxIndexedOrSolutionsReached: false,
          maxIndexedAndSolutionsReached: false,
          maxScansToExplodeReached: false,
          winningPlan: {
            stage: 'FETCH',
            filter: { email: { '$eq': 'user5000@gmail.com' } },
            inputStage: {
              stage: 'IXSCAN',
              keyPattern: { email: 'hashed' },                                      -->*// ← Using hashed index*
              indexName: 'email_hashed',
              isMultiKey: false,
              isUnique: false,
              isSparse: false,
              isPartial: false,
              indexVersion: 2,
              direction: 'forward',
              indexBounds: {
                email: [ '[7677552327051713248, 7677552327051713248]' ]
              }
            }
          },
          rejectedPlans: []
        }
      ]
    }
  },
  executionStats: {
    nReturned: 1,
    executionTimeMillis: 2,
    totalKeysExamined: 1,
    totalDocsExamined: 1,
    executionStages: {
      stage: 'SINGLE_SHARD',                  -->*// ← Mongos sent query to ONLY 1 shard*
      nReturned: 1,
      executionTimeMillis: 2,
      totalKeysExamined: 1,
      totalDocsExamined: 1,
      totalChildMillis: Long('0'),
      shards: [
        {
          shardName: 'shard1ReplSet',                                                         -->*user5000 is on shard1*// ← This specific shard
          executionSuccess: true,
          nReturned: 1,
          executionTimeMillis: 0,
          totalKeysExamined: 1,
          totalDocsExamined: 1,
          executionStages: {
            stage: 'FETCH',
            filter: { email: { '$eq': 'user5000@gmail.com' } },
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
              keyPattern: { email: 'hashed' },
              indexName: 'email_hashed',
              isMultiKey: false,
              isUnique: false,
              isSparse: false,
              isPartial: false,
              indexVersion: 2,
              direction: 'forward',
              indexBounds: {
                email: [ '[7677552327051713248, 7677552327051713248]' ]                            -->*Looking for EXACT hash match only*
              },
              keysExamined: 1,
              seeks: 1,
              dupsTested: 0,
              dupsDropped: 0
            }
          }
        }
      ]
    }
  },
  serverInfo: {
    host: '46adeecca2eb',
    port: 27017,
    version: '7.0.37',
    gitVersion: '9d30419d900008ba3ecf2a14546b236f2158b65b'
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
    internalQueryFrameworkControl: 'forceClassicEngine'
  },
  command: {
    find: 'users',
    filter: { email: 'user5000@gmail.com' },
    lsid: { id: UUID('10819cce-af83-44b5-a27b-35bb9e67ea02') },
    '$clusterTime': {
      clusterTime: Timestamp({ t: 1782367876, i: 1 }),
      signature: {
        hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
        keyId: 0
      }
    },
    '$db': 'indexpoc'
  },
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782367927, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782367927, i: 1 })
}
[direct: mongos] indexpoc> 
*totalKeysExamined: 1,   // ← Checked 1 index entry*
*totalDocsExamined: 1,   // ← Read 1 document*
*executionTimeMillis: 0  // ← Instant*

### Terminal output for range:
[direct: mongos] config> use indexpoc
switched to db indexpoc
[direct: mongos] indexpoc> db.users.find({ 
|     email: { $gte: "user5000@gmail.com", $lte: "user5099@gmail.com" } 
| }).explain("executionStats")
{
  queryPlanner: {
    mongosPlannerVersion: 1,
    winningPlan: {
      stage: 'SHARD_MERGE',
      shards: [
        {
          shardName: 'shard2ReplSet',
          connectionString: 'shard2ReplSet/shard2a:27018,shard2b:27018',
          serverInfo: {
            host: '0e09f8e109ad',
            port: 27018,
            version: '7.0.37',
            gitVersion: '9d30419d900008ba3ecf2a14546b236f2158b65b'
          },
          namespace: 'indexpoc.users',
          indexFilterSet: false,
          parsedQuery: {
            '$and': [
              { email: { '$lte': 'user5099@gmail.com' } },
              { email: { '$gte': 'user5000@gmail.com' } }
            ]
          },
          queryHash: '5AC968EF',
          planCacheKey: '801FC5C1',
          optimizationTimeMillis: 0,
          maxIndexedOrSolutionsReached: false,
          maxIndexedAndSolutionsReached: false,
          maxScansToExplodeReached: false,
          winningPlan: {
            stage: 'SHARDING_FILTER',
            inputStage: {
              stage: 'COLLSCAN',
              filter: {
                '$and': [
                  { email: { '$lte': 'user5099@gmail.com' } },
                  { email: { '$gte': 'user5000@gmail.com' } }
                ]
              },
              direction: 'forward'
            }
          },
          rejectedPlans: []
        },
        {
          shardName: 'shard1ReplSet',
          connectionString: 'shard1ReplSet/shard1a:27018,shard1b:27018',
          serverInfo: {
            host: '5bb057d7a917',
            port: 27018,
            version: '7.0.37',
            gitVersion: '9d30419d900008ba3ecf2a14546b236f2158b65b'
          },
          namespace: 'indexpoc.users',
          indexFilterSet: false,
          parsedQuery: {
            '$and': [
              { email: { '$lte': 'user5099@gmail.com' } },
              { email: { '$gte': 'user5000@gmail.com' } }
            ]
          },
          queryHash: '5AC968EF',
          planCacheKey: '801FC5C1',
          optimizationTimeMillis: 0,
          maxIndexedOrSolutionsReached: false,
          maxIndexedAndSolutionsReached: false,
          maxScansToExplodeReached: false,
          winningPlan: {
            stage: 'SHARDING_FILTER',
            inputStage: {
              stage: 'COLLSCAN',
              filter: {
                '$and': [
                  { email: { '$lte': 'user5099@gmail.com' } },
                  { email: { '$gte': 'user5000@gmail.com' } }
                ]
              },
              direction: 'forward'
            }
          },
          rejectedPlans: []
        }
      ]
    }
  },
  executionStats: {
    nReturned: 109,
    executionTimeMillis: 33,
    totalKeysExamined: 0,
    totalDocsExamined: 10000,
    executionStages: {
      stage: 'SHARD_MERGE',
      nReturned: 109,
      executionTimeMillis: 33,
      totalKeysExamined: 0,
      totalDocsExamined: 10000,
      totalChildMillis: Long('62'),
      shards: [
        {
          shardName: 'shard2ReplSet',
          executionSuccess: true,
          nReturned: 54,
          executionTimeMillis: 31,
          totalKeysExamined: 0,
          totalDocsExamined: 4947,
          executionStages: {
            stage: 'SHARDING_FILTER',
            nReturned: 54,
            executionTimeMillisEstimate: 0,
            works: 4948,
            advanced: 54,
            needTime: 4893,
            needYield: 0,
            saveState: 4,
            restoreState: 4,
            isEOF: 1,
            chunkSkips: 0,
            inputStage: {
              stage: 'COLLSCAN',
              filter: {
                '$and': [
                  { email: { '$lte': 'user5099@gmail.com' } },
                  { email: { '$gte': 'user5000@gmail.com' } }
                ]
              },
              nReturned: 54,
              executionTimeMillisEstimate: 0,
              works: 4948,
              advanced: 54,
              needTime: 4893,
              needYield: 0,
              saveState: 4,
              restoreState: 4,
              isEOF: 1,
              direction: 'forward',
              docsExamined: 4947
            }
          }
        },
        {
          shardName: 'shard1ReplSet',
          executionSuccess: true,
          nReturned: 55,
          executionTimeMillis: 31,
          totalKeysExamined: 0,
          totalDocsExamined: 5053,
          executionStages: {
            stage: 'SHARDING_FILTER',
            nReturned: 55,
            executionTimeMillisEstimate: 0,
            works: 5054,
            advanced: 55,
            needTime: 4998,
            needYield: 0,
            saveState: 5,
            restoreState: 5,
            isEOF: 1,
            chunkSkips: 0,
            inputStage: {
              stage: 'COLLSCAN',
              filter: {
                '$and': [
                  { email: { '$lte': 'user5099@gmail.com' } },
                  { email: { '$gte': 'user5000@gmail.com' } }
                ]
              },
              nReturned: 55,
              executionTimeMillisEstimate: 0,
              works: 5054,
              advanced: 55,
              needTime: 4998,
              needYield: 0,
              saveState: 5,
              restoreState: 5,
              isEOF: 1,
              direction: 'forward',
              docsExamined: 5053
            }
          }
        }
      ]
    }
  },
  serverInfo: {
    host: '46adeecca2eb',
    port: 27017,
    version: '7.0.37',
    gitVersion: '9d30419d900008ba3ecf2a14546b236f2158b65b'
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
    internalQueryFrameworkControl: 'forceClassicEngine'
  },
  command: {
    find: 'users',
    filter: {
      email: { '$gte': 'user5000@gmail.com', '$lte': 'user5099@gmail.com' }
    },
    lsid: { id: UUID('10819cce-af83-44b5-a27b-35bb9e67ea02') },
    '$clusterTime': {
      clusterTime: Timestamp({ t: 1782368291, i: 2 }),
      signature: {
        hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
        keyId: 0
      }
    },
    '$db': 'indexpoc'
  },
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782368295, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782368291, i: 1 })
}
[direct: mongos] indexpoc> 

### Now Compare Both Outputs Side-by-Side:
✅ Equality Query (Your First Output)
stage: 'SINGLE_SHARD'           // ← Only 1 shard
shardName: 'shard1ReplSet'      // ← Specific shard

// On that shard:
stage: 'IXSCAN'                 // ← Used hashed index
indexName: 'email_hashed'
indexBounds: { 
  email: [ '[7677552327051713248, 7677552327051713248]' ]  // ← Exact point
}
totalKeysExamined: 1            // ← 1 index lookup
totalDocsExamined: 1            // ← 1 document
executionTimeMillis: 0          // ← Instant

❌ Range Query (This Output)
stage: 'SHARD_MERGE'            // ← Querying ALL shards + merging

// Shard 1:
stage: 'COLLSCAN'               // ← Full collection scan!
totalKeysExamined: 0            // ← ZERO keys (no index)
docsExamined: 5053              // ← Scanned all 5053 docs on this shard

// Shard 2:
stage: 'COLLSCAN'               // ← Full collection scan!
totalKeysExamined: 0            // ← ZERO keys (no index)
docsExamined: 4947              // ← Scanned all 4947 docs on this shard

// Total:
totalKeysExamined: 0            // ← Index IGNORED
totalDocsExamined: 10000        // ← Scanned EVERY document
executionTimeMillis: 33         // ← 33x slower than equality

### Visual Comparison:
*Equality Query Path:*
mongos receives: { email: "user5000@gmail.com" }
    ↓
hash("user5000@gmail.com") → 7677552327051713248
    ↓
Lookup chunk table: Hash X belongs to → shard1ReplSet
    ↓
Route to SHARD 1 ONLY
    ↓
IXSCAN: Find 7677552327051713248 in B-Tree → 1 document
    ↓
Return: 1 result in 0ms

*Range Query Path:*
mongos receives: { email: { $gte: "user5000", $lte: "user5099" } }
    ↓
hash("user5000") → Random
hash("user5099") → Random
    ↓
Can't determine which shards have these emails
    ↓
MUST QUERY ALL SHARDS (SHARD_MERGE)
    ↓
Shard 1: COLLSCAN 5053 docs → find 55 matches
Shard 2: COLLSCAN 4947 docs → find 54 matches
    ↓
Merge results: 109 total
    ↓
Return: 109 results in 33ms

### Imagine a Library Analogy
You're the librarian (mongos). Someone asks:
"Find the book with ISBN 978-1234567890"

You have a catalog that tells you exactly which floor:
ISBN 978-1234567890 → Floor 2, Shelf 5
You go to ONLY Floor 2 → Found it! 🎯

* This is SINGLE_SHARD (targeted query)

"Find all books about 'cooking' published after 2020"

Your catalog doesn't track topics or years. So you:
📢 Announce on ALL floors: "Check your shelves for cooking books from 2021+"
Floor 1 searches their 5000 books → finds 20
Floor 2 searches their 5000 books → finds 15
Floor 3 searches their 5000 books → finds 25
You collect all results: 20 + 15 + 25 = 60 books

* This is SCATTER-GATHER

*without shard key means without hash index and it means it will search all the shard cluster*?
Exactly right! 🎯

Without shard key → mongos can't calculate hash → can't look up which shard owns the data → must ask every shard to search their entire collection → scatter-gather.

// With shard key (email)
db.users.find({ email: "user5000@gmail.com" })
// mongos: hash() → Chunk lookup → "Shard 1!" → Only Shard 1

// Without shard key (name)
db.users.find({ name: "User5000" })
// mongos: "No email to hash. No idea where this is." → All Shards

* One sentence: No shard key = no hash = no chunk lookup = broadcast to all shards.

### Real Numbers From Your Output:
Query	                                  Stage	Shards              Used	Docs                 Searched
{ email: "user5000@gmail.com" }	         SINGLE_SHARD	              1 shard	                   1 doc
{ name: "User5000" }	                   SHARD_MERGE	              2 shards	              10,000 docs

### The Biggest Lesson : Summary

Look at these two outputs:
1. Equality
SINGLE_SHARD
IXSCAN
Docs Examined = 1
2. Range
SHARD_MERGE
COLLSCAN
Docs Examined = 10000

That difference is exactly why people say:
Hashed shard keys are excellent for equality lookups and distribution,
but terrible for range queries.


# Shard 1 Replica Set Status Terminal log:-
------------------------------------------
keerthana@Keerthanas-MacBook-Air indexes % docker ps
CONTAINER ID   IMAGE     COMMAND                  CREATED       STATUS       PORTS                                             NAMES
46adeecca2eb   mongo:7   "docker-entrypoint.s…"   3 hours ago   Up 3 hours   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp   ecommerce-backend-mongos-1
c9a8b7a17c68   mongo:7   "docker-entrypoint.s…"   3 hours ago   Up 3 hours   0.0.0.0:27019->27019/tcp, [::]:27019->27019/tcp   ecommerce-backend-configsvr1-1
5bb057d7a917   mongo:7   "docker-entrypoint.s…"   3 hours ago   Up 3 hours   0.0.0.0:27018->27018/tcp, [::]:27018->27018/tcp   ecommerce-backend-shard1a-1
1e7c1baff8c0   mongo:7   "docker-entrypoint.s…"   3 hours ago   Up 3 hours   27017/tcp                                         ecommerce-backend-shard2b-1
c9166f94d7ab   mongo:7   "docker-entrypoint.s…"   3 hours ago   Up 3 hours   27017/tcp                                         ecommerce-backend-shard1b-1
0e09f8e109ad   mongo:7   "docker-entrypoint.s…"   3 hours ago   Up 3 hours   0.0.0.0:27028->27018/tcp, [::]:27028->27018/tcp   ecommerce-backend-shard2a-1
keerthana@Keerthanas-MacBook-Air indexes % docker exec -it 5bb057d7a917 mongosh --port 27018
Current Mongosh Log ID: 6a3cecd38de24229d2d1a7ba
Connecting to:          mongodb://127.0.0.1:27018/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          7.0.37
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the disableTelemetry() command.

------
   The server generated these startup warnings when booting
   2026-06-25T05:56:30.968+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-25T05:56:31.764+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-25T05:56:31.764+00:00: For customers running MongoDB 7.0, we suggest changing the contents of the following sysfsFile
------

shard1ReplSet [direct: primary] test> rs.status()
{
  set: 'shard1ReplSet',
  date: ISODate('2026-06-25T08:55:03.589Z'),
  myState: 1,
  term: Long('4'),
  syncSourceHost: '',
  syncSourceId: -1,
  heartbeatIntervalMillis: Long('2000'),
  majorityVoteCount: 2,
  writeMajorityCount: 2,
  votingMembersCount: 2,
  writableVotingMembersCount: 2,
  optimes: {
    lastCommittedOpTime: { ts: Timestamp({ t: 1782377701, i: 1 }), t: Long('4') },
    lastCommittedWallTime: ISODate('2026-06-25T08:55:01.679Z'),
    readConcernMajorityOpTime: { ts: Timestamp({ t: 1782377701, i: 1 }), t: Long('4') },
    appliedOpTime: { ts: Timestamp({ t: 1782377701, i: 1 }), t: Long('4') },
    durableOpTime: { ts: Timestamp({ t: 1782377701, i: 1 }), t: Long('4') },
    lastAppliedWallTime: ISODate('2026-06-25T08:55:01.679Z'),
    lastDurableWallTime: ISODate('2026-06-25T08:55:01.679Z')
  },
  lastStableRecoveryTimestamp: Timestamp({ t: 1782377691, i: 1 }),
  electionCandidateMetrics: {
    lastElectionReason: 'electionTimeout',
    lastElectionDate: ISODate('2026-06-25T08:24:22.828Z'),
    electionTerm: Long('4'),
    lastCommittedOpTimeAtElection: { ts: Timestamp({ t: 1782374723, i: 1 }), t: Long('3') },
    lastSeenOpTimeAtElection: { ts: Timestamp({ t: 1782374723, i: 1 }), t: Long('3') },
    numVotesNeeded: 2,
    priorityAtElection: 1,
    electionTimeoutMillis: Long('10000'),
    numCatchUpOps: Long('0'),
    newTermStartDate: ISODate('2026-06-25T08:24:22.834Z'),
    wMajorityWriteAvailabilityDate: ISODate('2026-06-25T08:24:22.843Z')
  },
  electionParticipantMetrics: {
    votedForCandidate: true,
    electionTerm: Long('3'),
    lastVoteDate: ISODate('2026-06-25T08:05:13.845Z'),
    electionCandidateMemberId: 1,
    voteReason: '',
    lastAppliedOpTimeAtElection: { ts: Timestamp({ t: 1782374703, i: 1 }), t: Long('2') },
    maxAppliedOpTimeInSet: { ts: Timestamp({ t: 1782374703, i: 1 }), t: Long('2') },
    priorityAtElection: 1
  },
  members: [
    {
      _id: 0,
      name: 'shard1a:27018',
      health: 1,
      state: 1,
      stateStr: 'PRIMARY',
      uptime: 10713,
      optime: { ts: Timestamp({ t: 1782377701, i: 1 }), t: Long('4') },
      optimeDate: ISODate('2026-06-25T08:55:01.000Z'),
      lastAppliedWallTime: ISODate('2026-06-25T08:55:01.679Z'),
      lastDurableWallTime: ISODate('2026-06-25T08:55:01.679Z'),
      syncSourceHost: '',
      syncSourceId: -1,
      infoMessage: '',
      electionTime: Timestamp({ t: 1782375862, i: 3 }),
      electionDate: ISODate('2026-06-25T08:24:22.000Z'),
      configVersion: 1,
      configTerm: 4,
      self: true,
      lastHeartbeatMessage: ''
    },
    {
      _id: 1,
      name: 'shard1b:27018',
      health: 1,
      state: 2,
      stateStr: 'SECONDARY',
      uptime: 10646,
      optime: { ts: Timestamp({ t: 1782377701, i: 1 }), t: Long('4') },
      optimeDurable: { ts: Timestamp({ t: 1782377701, i: 1 }), t: Long('4') },
      optimeDate: ISODate('2026-06-25T08:55:01.000Z'),
      optimeDurableDate: ISODate('2026-06-25T08:55:01.000Z'),
      lastAppliedWallTime: ISODate('2026-06-25T08:55:01.679Z'),
      lastDurableWallTime: ISODate('2026-06-25T08:55:01.679Z'),
      lastHeartbeat: ISODate('2026-06-25T08:55:02.837Z'),
      lastHeartbeatRecv: ISODate('2026-06-25T08:55:02.837Z'),
      pingMs: Long('0'),
      lastHeartbeatMessage: '',
      syncSourceHost: 'shard1a:27018',
      syncSourceId: 0,
      infoMessage: '',
      configVersion: 1,
      configTerm: 4
    }
  ],
  ok: 1,
  '$clusterTime': {
    clusterTime: Timestamp({ t: 1782377701, i: 1 }),
    signature: {
      hash: Binary.createFromBase64('AAAAAAAAAAAAAAAAAAAAAAAAAAA=', 0),
      keyId: Long('0')
    }
  },
  operationTime: Timestamp({ t: 1782377701, i: 1 })
}
shard1ReplSet [direct: primary] test> use indexpoc
switched to db indexpoc
shard1ReplSet [direct: primary] indexpoc> db.users.countDocuments()
5053

##### Terminal 1 (shard1b - SECONDARY of Shard 1)::
keerthana@Keerthanas-MacBook-Air indexes % docker exec -it c9166f94d7ab mongosh --port 27018
Current Mongosh Log ID: 6a3cee061e753c21efd1a7ba
Connecting to:          mongodb://127.0.0.1:27018/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:          7.0.37
Using Mongosh:          2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-25T05:56:30.954+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2026-06-25T05:56:31.741+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
   2026-06-25T05:56:31.741+00:00: For customers running MongoDB 7.0, we suggest changing the contents of the following sysfsFile
------

shard1ReplSet [direct: secondary] test> use indexpoc
switched to db indexpoc
shard1ReplSet [direct: secondary] indexpoc> db.users.countDocuments()
5053
shard1ReplSet [direct: secondary] indexpoc> db.users.findOne({ email: "user5000@gmail.com" })
{
  _id: ObjectId('6a3cc44af407a810591be31d'),
  email: 'user5000@gmail.com',
  name: 'User5000',
  age: 17,
  __v: 0
}
shard1ReplSet [direct: secondary] indexpoc> 


#### MongoDB Doesn't Insert One-by-One in Sharded Cluster:
----------------------------------------------------------
*i understand, before inserting user in mongodb sharder cluster it will chunk the data beacuse it will not insert one by one doc?*
❌ NOT THIS:
mongos: "Insert user0" → hash → Shard 1
mongos: "Insert user1" → hash → Shard 2
mongos: "Insert user2" → hash → Shard 1
(one at a time - too slow)

✅ THIS:
mongos: "I have 10000 users to insert"
mongos: Hashes all emails → Groups by chunk range
        ┌─────────────────┐  ┌─────────────────┐
        │ Chunk A (0 to X) │  │ Chunk B (X to ∞) │
        │ 5053 users       │  │ 4947 users       │
        └─────────────────┘  └─────────────────┘
              ↓                      ↓
          Shard 1               Shard 2
        (one batch!)          (one batch!)

*What Chunks Do:*
1. Chunks = Data Buckets
text
Instead of:
  "Move user5000 to Shard 2"
  "Move user5001 to Shard 2"
  ... (impossible to do one-by-one)

MongoDB does:
  "Move Chunk 2 (2500 users) to Shard 2"  ← One operation!
2. Chunks Auto-Split
text
When 2500 users → chunk gets too big (64MB default)

Before:
┌──────────────────────┐
│      Chunk 1         │  (5000 users, 400MB)
└──────────────────────┘

After auto-split:
┌──────────┐ ┌──────────┐
│ Chunk 1A │ │ Chunk 1B │  (2500 users each, 200MB)
└──────────┘ └──────────┘
3. Balancer Uses Chunks
text
Shard 1: 10 chunks (hot)     Shard 2: 2 chunks (cold)
     ↓                              ↓
Balancer detects imbalance → moves chunks

Shard 1: 6 chunks              Shard 2: 6 chunks  ✅ Balanced!

## One-Liner:
MongoDB hashes the shard key first, groups documents by chunk range, then sends each group as a single batch to the correct shard — not one-by-one.

*That's Why Chunks Matter:*
Without chunks:
  Insert 10,000 docs → 10,000 network calls → SLOW

With chunks:
  Insert 10,000 docs → hash → group → 2 network calls → FAST


# 1 million insert record to check chunk terminal logs:
keerthana@Keerthanas-MacBook-Air indexes % mongosh --port 27017
Current Mongosh Log ID:	6a3cfd623dcf3d5951f20282
Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.8.3
Using MongoDB:		7.0.37
Using Mongosh:		2.8.3

For mongosh info see: https://www.mongodb.com/docs/mongodb-shell/

------
   The server generated these startup warnings when booting
   2026-06-25T05:56:31.149+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
------

[direct: mongos] test> use indexpoc
switched to db indexpoc
[direct: mongos] indexpoc> db.users.getShardDistribution()
Shard shard2ReplSet at shard2ReplSet/shard2a:27018,shard2b:27018
{
  data: '44.23MiB',
  docs: 499947,
  chunks: 1,
  'estimated data per chunk': '44.23MiB',
  'estimated docs per chunk': 499947
}
---
Shard shard1ReplSet at shard1ReplSet/shard1a:27018,shard1b:27018
{
  data: '44.24MiB',
  docs: 500053,
  chunks: 1,
  'estimated data per chunk': '44.24MiB',
  'estimated docs per chunk': 500053
}
---
Totals
{
  data: '88.47MiB',
  docs: 1000000,
  chunks: 2,
  'Shard shard2ReplSet': [
    '49.99 % data',
    '49.99 % docs in cluster',
    '92B avg obj size on shard'
  ],
  'Shard shard1ReplSet': [ '50 % data', '50 % docs in cluster', '92B avg obj size on shard' ]
}
[direct: mongos] indexpoc> use config
switched to db config
[direct: mongos] config> db.chunks.countDocuments({
|    uuid: db.getSiblingDB("config")
|             .collections
|             .findOne({_id:"indexpoc.users"})
|             .uuid
| })
2
[direct: mongos] config> sh.status()
shardingVersion
{ _id: 1, clusterId: ObjectId('6a3cc34ddd9fa1ef53a3cf85') }
---
shards
[
  {
    _id: 'shard1ReplSet',
    host: 'shard1ReplSet/shard1a:27018,shard1b:27018',
    state: 1,
    topologyTime: Timestamp({ t: 1782367068, i: 8 })
  },
  {
    _id: 'shard2ReplSet',
    host: 'shard2ReplSet/shard2a:27018,shard2b:27018',
    state: 1,
    topologyTime: Timestamp({ t: 1782367071, i: 8 })
  }
]
---
active mongoses
[ { '7.0.37': 1 } ]
---
autosplit
{ 'Currently enabled': 'yes' }
---
automerge
{ 'Currently enabled': 'yes' }
---
balancer
{
  'Currently enabled': 'yes',
  'Failed balancer rounds in last 5 attempts': 0,
  'Currently running': 'no',
  'Migration Results for the last 24 hours': 'No recent migrations'
}
---
shardedDataDistribution
[
  {
    ns: 'indexpoc.users',
    shards: [
      {
        shardName: 'shard1ReplSet',
        numOrphanedDocs: 0,
        numOwnedDocuments: 500053,
        ownedSizeBytes: 46004876,
        orphanedSizeBytes: 0
      },
      {
        shardName: 'shard2ReplSet',
        numOrphanedDocs: 0,
        numOwnedDocuments: 499947,
        ownedSizeBytes: 45995124,
        orphanedSizeBytes: 0
      }
    ]
  },
  {
    ns: 'config.system.sessions',
    shards: [
      {
        shardName: 'shard1ReplSet',
        numOrphanedDocs: 0,
        numOwnedDocuments: 13,
        ownedSizeBytes: 1287,
        orphanedSizeBytes: 0
      }
    ]
  }
]
---
databases
[
  {
    database: { _id: 'config', primary: 'config', partitioned: true },
    collections: {
      'config.system.sessions': {
        shardKey: { _id: 1 },
        unique: false,
        balancing: true,
        allowMigrations: true,
        chunkMetadata: [ { shard: 'shard1ReplSet', nChunks: 1 } ],
        chunks: [
          { min: { _id: MinKey() }, max: { _id: MaxKey() }, 'on shard': 'shard1ReplSet', 'last modified': Timestamp({ t: 1, i: 0 }) }
        ],
        tags: []
      }
    }
  },
  {
    database: {
      _id: 'indexpoc',
      primary: 'shard2ReplSet',
      partitioned: false,
      version: {
        uuid: UUID('d1ccafc8-135c-4e93-84c8-f9fb18264f6b'),
        timestamp: Timestamp({ t: 1782367143, i: 1 }),
        lastMod: 1
      }
    },
    collections: {
      'indexpoc.users': {
        shardKey: { email: 'hashed' },
        unique: false,
        balancing: true,
        allowMigrations: true,
        chunkMetadata: [
          { shard: 'shard1ReplSet', nChunks: 1 },
          { shard: 'shard2ReplSet', nChunks: 1 }
        ],
        chunks: [
          { min: { email: MinKey() }, max: { email: Long('0') }, 'on shard': 'shard2ReplSet', 'last modified': Timestamp({ t: 1, i: 5 }) },
          { min: { email: Long('0') }, max: { email: MaxKey() }, 'on shard': 'shard1ReplSet', 'last modified': Timestamp({ t: 1, i: 4 }) }
        ],
        tags: []
      }
    }
  }
]
[direct: mongos] config> use indexpoc
switched to db indexpoc
[direct: mongos] indexpoc> db.users.stats()
{
  ok: 1,
  capped: false,
  wiredTiger: {
    metadata: { formatVersion: 1 },
    creationString: 'access_pattern_hint=none,allocation_size=4KB,app_metadata=(formatVersion=1),assert=(commit_timestamp=none,durable_timestamp=none,read_timestamp=none,write_timestamp=on),block_allocation=best,block_compressor=snappy,cache_resident=false,checksum=on,colgroups=,collator=,columns=,dictionary=0,encryption=(keyid=,name=),exclusive=false,extractor=,format=btree,huffman_key=,huffman_value=,ignore_in_memory_cache_size=false,immutable=false,import=(compare_timestamp=oldest_timestamp,enabled=false,file_metadata=,metadata_file=,repair=false),internal_item_max=0,internal_key_max=0,internal_key_truncate=true,internal_page_max=4KB,key_format=q,key_gap=10,leaf_item_max=0,leaf_key_max=0,leaf_page_max=32KB,leaf_value_max=64MB,log=(enabled=false),lsm=(auto_throttle=true,bloom=true,bloom_bit_count=16,bloom_config=,bloom_hash_count=8,bloom_oldest=false,chunk_count_limit=0,chunk_max=5GB,chunk_size=10MB,merge_custom=(prefix=,start_generation=0,suffix=),merge_max=15,merge_min=0),memory_page_image_max=0,memory_page_max=10m,os_cache_dirty_max=0,os_cache_max=0,prefix_compression=false,prefix_compression_min=4,source=,split_deepen_min_child=0,split_deepen_per_child=0,split_pct=90,tiered_storage=(auth_token=,bucket=,bucket_prefix=,cache_directory=,local_retention=300,name=,object_target_size=0),type=file,value_format=u,verbose=[write_timestamp],write_timestamp_usage=none',
    type: 'file',
    uri: 'statistics:table:collection-54-6084271676884376252',
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
    'block-manager': {
      'allocations requiring file extension': 559,
      'blocks allocated': 1067,
      'blocks freed': 515,
      'checkpoint size': 15818752,
      'file allocation unit size': 4096,
      'file bytes available for reuse': 1359872,
      'file magic number': 120897,
      'file major version number': 1,
      'file size in bytes': 17195008,
      'minor version number': 0
    },
    btree: {
      'btree checkpoint generation': 124,
      'btree clean tree checkpoint expiration time': Long('9223372036854775807'),
      'btree compact pages reviewed': 0,
      'btree compact pages rewritten': 0,
      'btree compact pages skipped': 0,
      'btree number of pages reconciled during checkpoint': 56,
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
      'bytes currently in the cache': 76488297,
      'bytes dirty in the cache cumulative': 17909900,
      'bytes read into cache': 25582414,
      'bytes written from cache': 112753855,
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
      'eviction walk pages seen that had updates': 114,
      'eviction walk pages seen that were clean': 905,
      'eviction walk pages seen that were dirty': 23,
      'eviction walk passes of a file': 12,
      'eviction walk target pages histogram - 0-9': 0,
      'eviction walk target pages histogram - 10-31': 1,
      'eviction walk target pages histogram - 128 and higher': 0,
      'eviction walk target pages histogram - 32-63': 11,
      'eviction walk target pages histogram - 64-128': 0,
      'eviction walk target pages reduced due to history store cache pressure': 0,
      'eviction walks abandoned': 0,
      'eviction walks gave up because they restarted their walk twice': 12,
      'eviction walks gave up because they saw too many pages and found no candidates': 0,
      'eviction walks gave up because they saw too many pages and found too few candidates': 0,
      'eviction walks random search fails to locate a page, results in a null position': 0,
      'eviction walks reached end of tree': 24,
      'eviction walks restarted': 0,
      'eviction walks started from root of tree': 12,
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
      'in-memory page passed criteria to be split': 33,
      'in-memory page splits': 11,
      'internal page split blocked its eviction': 0,
      'internal pages evicted': 0,
      'internal pages split during eviction': 0,
      'leaf pages split during eviction': 18,
      'locate a random in-mem ref by examining all entries on the root page': 0,
      'modified pages evicted': 33,
      'multi-block reconciliation blocked whilst checkpoint is running': 0,
      'obsolete updates removed': 0,
      'overflow keys on a multiblock row-store page blocked its eviction': 0,
      'overflow pages read into cache': 0,
      'page split during eviction deepened the tree': 0,
      'page written requiring history store records': 0,
      'pages read into cache': 216,
      'pages read into cache after truncate': 0,
      'pages read into cache after truncate in prepare state': 0,
      'pages requested from the cache': 597343,
      'pages seen by eviction walk': 1060,
      'pages written from cache': 1029,
      'pages written requiring in-memory restoration': 7,
      'recent modification of a page blocked its eviction': 0,
      'reverse splits performed': 0,
      'reverse splits skipped because of VLCS namespace gap restrictions': 0,
      'the number of times full update inserted to history store': 0,
      'the number of times reverse modify inserted to history store': 0,
      'tracked dirty bytes in the cache': 0,
      'tracked dirty internal page bytes in the cache': 0,
      'tracked dirty leaf page bytes in the cache': 0,
      'uncommitted truncate blocked page eviction': 0,
      'unmodified pages evicted': 8
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
    'checkpoint-cleanup': {
      'most recent duration on all eligible files (usecs)': 0,
      'most recent handles processed': 0,
      'pages added for eviction': 23,
      'pages removed': 24,
      'pages skipped during tree walk': 24,
      'pages visited': 2192
    },
    compression: {
      'compressed page maximum internal page size prior to compression': 4096,
      'compressed page maximum leaf page size prior to compression ': 131072,
      'compressed pages read': 216,
      'compressed pages written': 980,
      'number of blocks with compress ratio greater than 64': 0,
      'number of blocks with compress ratio smaller than 16': 0,
      'number of blocks with compress ratio smaller than 2': 0,
      'number of blocks with compress ratio smaller than 32': 0,
      'number of blocks with compress ratio smaller than 4': 191,
      'number of blocks with compress ratio smaller than 64': 0,
      'number of blocks with compress ratio smaller than 8': 25,
      'page written failed to compress': 0,
      'page written was too small to compress': 49
    },
    cursor: {
      'Total number of deleted pages skipped during tree walk': 368,
      'Total number of entries skipped by cursor next calls': 610989,
      'Total number of entries skipped by cursor prev calls': 0,
      'Total number of entries skipped to position the history store cursor': 0,
      'Total number of in-memory deleted pages skipped during tree walk': 515,
      'Total number of on-disk deleted pages skipped during tree walk': 0,
      'Total number of times a search near has exited due to prefix config': 0,
      'Total number of times cursor fails to temporarily release pinned page to encourage eviction of hot or large page': 0,
      'Total number of times cursor temporarily releases pinned page to encourage eviction of hot or large page': 0,
      'bulk loaded cursor insert calls': 0,
      'cache cursors reuse count': 275688,
      'close calls that result in cache': 275694,
      'create calls': 44,
      'cursor bound calls that return an error': 0,
      'cursor bounds cleared from reset': 0,
      'cursor bounds comparisons performed': 0,
      'cursor bounds next called on an unpositioned cursor': 0,
      'cursor bounds next early exit': 0,
      'cursor bounds prev called on an unpositioned cursor': 0,
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
      'cursor next calls that skip greater than 1 and fewer than 100 entries': 0,
      'cursor next calls that skip greater than or equal to 100 entries': 144,
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
      'insert calls': 534576,
      'insert key and value bytes': 51514297,
      modify: 0,
      'modify key and value bytes affected': 0,
      'modify value bytes modified': 0,
      'next calls': 7545667,
      'open cursor count': 0,
      'operation restarted': 182,
      'prev calls': 1,
      'remove calls': 34629,
      'remove key bytes removed': 95313,
      'reserve calls': 0,
      'reset calls': 615141,
      'search calls': 71854,
      'search history store calls': 0,
      'search near calls': 9975,
      'truncate calls': 0,
      'update calls': 0,
      'update key and value bytes': 0,
      'update value size change': 0
    },
    reconciliation: {
      'VLCS pages explicitly reconciled as empty': 0,
      'approximate byte size of timestamps in pages written': 16254864,
      'approximate byte size of transaction IDs in pages written': 8127432,
      'cursor next/prev calls during HS wrapup search_near': 0,
      'dictionary matches': 0,
      'fast-path pages deleted': 0,
      'internal page key bytes discarded using suffix compression': 1903,
      'internal page multi-block writes': 9,
      'leaf page key bytes discarded using prefix compression': 0,
      'leaf page multi-block writes': 39,
      'leaf-page overflow keys': 0,
      'maximum blocks required for a page': 1,
      'overflow values written': 0,
      'page reconciliation calls': 72,
      'page reconciliation calls for eviction': 7,
      'pages deleted': 0,
      'pages written including an aggregated newest start durable timestamp ': 41,
      'pages written including an aggregated newest stop durable timestamp ': 27,
      'pages written including an aggregated newest stop timestamp ': 16,
      'pages written including an aggregated newest stop transaction ID': 16,
      'pages written including an aggregated newest transaction ID ': 41,
      'pages written including an aggregated oldest start timestamp ': 41,
      'pages written including an aggregated prepare': 0,
      'pages written including at least one prepare': 0,
      'pages written including at least one start durable timestamp': 935,
      'pages written including at least one start timestamp': 935,
      'pages written including at least one start transaction ID': 935,
      'pages written including at least one stop durable timestamp': 69,
      'pages written including at least one stop timestamp': 69,
      'pages written including at least one stop transaction ID': 69,
      'records written including a prepare': 0,
      'records written including a start durable timestamp': 954610,
      'records written including a start timestamp': 954610,
      'records written including a start transaction ID': 954610,
      'records written including a stop durable timestamp': 61319,
      'records written including a stop timestamp': 61319,
      'records written including a stop transaction ID': 61319
    },
    session: { 'object compaction': 0 },
    transaction: {
      'a reader raced with a prepared transaction commit and skipped an update or updates': 0,
      'checkpoint has acquired a snapshot for its transaction': 0,
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
      'transaction checkpoints due to obsolete pages': 0,
      'update conflicts': 0
    }
  },
  shards: {
    shard2ReplSet: {
      size: 46384021,
      count: 499947,
      avgObjSize: 92,
      numOrphanDocs: 0,
      storageSize: 17195008,
      freeStorageSize: 1359872,
      capped: false,
      wiredTiger: {
        metadata: { formatVersion: 1 },
        creationString: 'access_pattern_hint=none,allocation_size=4KB,app_metadata=(formatVersion=1),assert=(commit_timestamp=none,durable_timestamp=none,read_timestamp=none,write_timestamp=on),block_allocation=best,block_compressor=snappy,cache_resident=false,checksum=on,colgroups=,collator=,columns=,dictionary=0,encryption=(keyid=,name=),exclusive=false,extractor=,format=btree,huffman_key=,huffman_value=,ignore_in_memory_cache_size=false,immutable=false,import=(compare_timestamp=oldest_timestamp,enabled=false,file_metadata=,metadata_file=,repair=false),internal_item_max=0,internal_key_max=0,internal_key_truncate=true,internal_page_max=4KB,key_format=q,key_gap=10,leaf_item_max=0,leaf_key_max=0,leaf_page_max=32KB,leaf_value_max=64MB,log=(enabled=false),lsm=(auto_throttle=true,bloom=true,bloom_bit_count=16,bloom_config=,bloom_hash_count=8,bloom_oldest=false,chunk_count_limit=0,chunk_max=5GB,chunk_size=10MB,merge_custom=(prefix=,start_generation=0,suffix=),merge_max=15,merge_min=0),memory_page_image_max=0,memory_page_max=10m,os_cache_dirty_max=0,os_cache_max=0,prefix_compression=false,prefix_compression_min=4,source=,split_deepen_min_child=0,split_deepen_per_child=0,split_pct=90,tiered_storage=(auth_token=,bucket=,bucket_prefix=,cache_directory=,local_retention=300,name=,object_target_size=0),type=file,value_format=u,verbose=[write_timestamp],write_timestamp_usage=none',
        type: 'file',
        uri: 'statistics:table:collection-54-6084271676884376252',
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
        'block-manager': {
          'allocations requiring file extension': 559,
          'blocks allocated': 1067,
          'blocks freed': 515,
          'checkpoint size': 15818752,
          'file allocation unit size': 4096,
          'file bytes available for reuse': 1359872,
          'file magic number': 120897,
          'file major version number': 1,
          'file size in bytes': 17195008,
          'minor version number': 0
        },
        btree: {
          'btree checkpoint generation': 124,
          'btree clean tree checkpoint expiration time': Long('9223372036854775807'),
          'btree compact pages reviewed': 0,
          'btree compact pages rewritten': 0,
          'btree compact pages skipped': 0,
          'btree number of pages reconciled during checkpoint': 56,
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
          'bytes currently in the cache': 76488297,
          'bytes dirty in the cache cumulative': 17909900,
          'bytes read into cache': 25582414,
          'bytes written from cache': 112753855,
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
          'eviction walk pages seen that had updates': 114,
          'eviction walk pages seen that were clean': 905,
          'eviction walk pages seen that were dirty': 23,
          'eviction walk passes of a file': 12,
          'eviction walk target pages histogram - 0-9': 0,
          'eviction walk target pages histogram - 10-31': 1,
          'eviction walk target pages histogram - 128 and higher': 0,
          'eviction walk target pages histogram - 32-63': 11,
          'eviction walk target pages histogram - 64-128': 0,
          'eviction walk target pages reduced due to history store cache pressure': 0,
          'eviction walks abandoned': 0,
          'eviction walks gave up because they restarted their walk twice': 12,
          'eviction walks gave up because they saw too many pages and found no candidates': 0,
          'eviction walks gave up because they saw too many pages and found too few candidates': 0,
          'eviction walks random search fails to locate a page, results in a null position': 0,
          'eviction walks reached end of tree': 24,
          'eviction walks restarted': 0,
          'eviction walks started from root of tree': 12,
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
          'in-memory page passed criteria to be split': 33,
          'in-memory page splits': 11,
          'internal page split blocked its eviction': 0,
          'internal pages evicted': 0,
          'internal pages split during eviction': 0,
          'leaf pages split during eviction': 18,
          'locate a random in-mem ref by examining all entries on the root page': 0,
          'modified pages evicted': 33,
          'multi-block reconciliation blocked whilst checkpoint is running': 0,
          'obsolete updates removed': 0,
          'overflow keys on a multiblock row-store page blocked its eviction': 0,
          'overflow pages read into cache': 0,
          'page split during eviction deepened the tree': 0,
          'page written requiring history store records': 0,
          'pages read into cache': 216,
          'pages read into cache after truncate': 0,
          'pages read into cache after truncate in prepare state': 0,
          'pages requested from the cache': 597343,
          'pages seen by eviction walk': 1060,
          'pages written from cache': 1029,
          'pages written requiring in-memory restoration': 7,
          'recent modification of a page blocked its eviction': 0,
          'reverse splits performed': 0,
          'reverse splits skipped because of VLCS namespace gap restrictions': 0,
          'the number of times full update inserted to history store': 0,
          'the number of times reverse modify inserted to history store': 0,
          'tracked dirty bytes in the cache': 0,
          'tracked dirty internal page bytes in the cache': 0,
          'tracked dirty leaf page bytes in the cache': 0,
          'uncommitted truncate blocked page eviction': 0,
          'unmodified pages evicted': 8
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
        'checkpoint-cleanup': {
          'most recent duration on all eligible files (usecs)': 0,
          'most recent handles processed': 0,
          'pages added for eviction': 23,
          'pages removed': 24,
          'pages skipped during tree walk': 24,
          'pages visited': 2192
        },
        compression: {
          'compressed page maximum internal page size prior to compression': 4096,
          'compressed page maximum leaf page size prior to compression ': 131072,
          'compressed pages read': 216,
          'compressed pages written': 980,
          'number of blocks with compress ratio greater than 64': 0,
          'number of blocks with compress ratio smaller than 16': 0,
          'number of blocks with compress ratio smaller than 2': 0,
          'number of blocks with compress ratio smaller than 32': 0,
          'number of blocks with compress ratio smaller than 4': 191,
          'number of blocks with compress ratio smaller than 64': 0,
          'number of blocks with compress ratio smaller than 8': 25,
          'page written failed to compress': 0,
          'page written was too small to compress': 49
        },
        cursor: {
          'Total number of deleted pages skipped during tree walk': 368,
          'Total number of entries skipped by cursor next calls': 610989,
          'Total number of entries skipped by cursor prev calls': 0,
          'Total number of entries skipped to position the history store cursor': 0,
          'Total number of in-memory deleted pages skipped during tree walk': 515,
          'Total number of on-disk deleted pages skipped during tree walk': 0,
          'Total number of times a search near has exited due to prefix config': 0,
          'Total number of times cursor fails to temporarily release pinned page to encourage eviction of hot or large page': 0,
          'Total number of times cursor temporarily releases pinned page to encourage eviction of hot or large page': 0,
          'bulk loaded cursor insert calls': 0,
          'cache cursors reuse count': 275688,
          'close calls that result in cache': 275694,
          'create calls': 44,
          'cursor bound calls that return an error': 0,
          'cursor bounds cleared from reset': 0,
          'cursor bounds comparisons performed': 0,
          'cursor bounds next called on an unpositioned cursor': 0,
          'cursor bounds next early exit': 0,
          'cursor bounds prev called on an unpositioned cursor': 0,
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
          'cursor next calls that skip greater than 1 and fewer than 100 entries': 0,
          'cursor next calls that skip greater than or equal to 100 entries': 144,
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
          'insert calls': 534576,
          'insert key and value bytes': 51514297,
          modify: 0,
          'modify key and value bytes affected': 0,
          'modify value bytes modified': 0,
          'next calls': 7545667,
          'open cursor count': 0,
          'operation restarted': 182,
          'prev calls': 1,
          'remove calls': 34629,
          'remove key bytes removed': 95313,
          'reserve calls': 0,
          'reset calls': 615141,
          'search calls': 71854,
          'search history store calls': 0,
          'search near calls': 9975,
          'truncate calls': 0,
          'update calls': 0,
          'update key and value bytes': 0,
          'update value size change': 0
        },
        reconciliation: {
          'VLCS pages explicitly reconciled as empty': 0,
          'approximate byte size of timestamps in pages written': 16254864,
          'approximate byte size of transaction IDs in pages written': 8127432,
          'cursor next/prev calls during HS wrapup search_near': 0,
          'dictionary matches': 0,
          'fast-path pages deleted': 0,
          'internal page key bytes discarded using suffix compression': 1903,
          'internal page multi-block writes': 9,
          'leaf page key bytes discarded using prefix compression': 0,
          'leaf page multi-block writes': 39,
          'leaf-page overflow keys': 0,
          'maximum blocks required for a page': 1,
          'overflow values written': 0,
          'page reconciliation calls': 72,
          'page reconciliation calls for eviction': 7,
          'pages deleted': 0,
          'pages written including an aggregated newest start durable timestamp ': 41,
          'pages written including an aggregated newest stop durable timestamp ': 27,
          'pages written including an aggregated newest stop timestamp ': 16,
          'pages written including an aggregated newest stop transaction ID': 16,
          'pages written including an aggregated newest transaction ID ': 41,
          'pages written including an aggregated oldest start timestamp ': 41,
          'pages written including an aggregated prepare': 0,
          'pages written including at least one prepare': 0,
          'pages written including at least one start durable timestamp': 935,
          'pages written including at least one start timestamp': 935,
          'pages written including at least one start transaction ID': 935,
          'pages written including at least one stop durable timestamp': 69,
          'pages written including at least one stop timestamp': 69,
          'pages written including at least one stop transaction ID': 69,
          'records written including a prepare': 0,
          'records written including a start durable timestamp': 954610,
          'records written including a start timestamp': 954610,
          'records written including a start transaction ID': 954610,
          'records written including a stop durable timestamp': 61319,
          'records written including a stop timestamp': 61319,
          'records written including a stop transaction ID': 61319
        },
        session: { 'object compaction': 0 },
        transaction: {
          'a reader raced with a prepared transaction commit and skipped an update or updates': 0,
          'checkpoint has acquired a snapshot for its transaction': 0,
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
          'transaction checkpoints due to obsolete pages': 0,
          'update conflicts': 0
        }
      },
      nindexes: 2,
      indexBuilds: [],
      totalIndexSize: 42815488,
      indexSizes: { _id_: 14843904, email_hashed: 27971584 },
      totalSize: 60010496,
      scaleFactor: 1
    },
    shard1ReplSet: {
      size: 46393759,
      count: 500053,
      avgObjSize: 92,
      numOrphanDocs: 0,
      storageSize: 16371712,
      freeStorageSize: 548864,
      capped: false,
      wiredTiger: {
        metadata: { formatVersion: 1 },
        creationString: 'access_pattern_hint=none,allocation_size=4KB,app_metadata=(formatVersion=1),assert=(commit_timestamp=none,durable_timestamp=none,read_timestamp=none,write_timestamp=on),block_allocation=best,block_compressor=snappy,cache_resident=false,checksum=on,colgroups=,collator=,columns=,dictionary=0,encryption=(keyid=,name=),exclusive=false,extractor=,format=btree,huffman_key=,huffman_value=,ignore_in_memory_cache_size=false,immutable=false,import=(compare_timestamp=oldest_timestamp,enabled=false,file_metadata=,metadata_file=,repair=false),internal_item_max=0,internal_key_max=0,internal_key_truncate=true,internal_page_max=4KB,key_format=q,key_gap=10,leaf_item_max=0,leaf_key_max=0,leaf_page_max=32KB,leaf_value_max=64MB,log=(enabled=false),lsm=(auto_throttle=true,bloom=true,bloom_bit_count=16,bloom_config=,bloom_hash_count=8,bloom_oldest=false,chunk_count_limit=0,chunk_max=5GB,chunk_size=10MB,merge_custom=(prefix=,start_generation=0,suffix=),merge_max=15,merge_min=0),memory_page_image_max=0,memory_page_max=10m,os_cache_dirty_max=0,os_cache_max=0,prefix_compression=false,prefix_compression_min=4,source=,split_deepen_min_child=0,split_deepen_per_child=0,split_pct=90,tiered_storage=(auth_token=,bucket=,bucket_prefix=,cache_directory=,local_retention=300,name=,object_target_size=0),type=file,value_format=u,verbose=[write_timestamp],write_timestamp_usage=none',
        type: 'file',
        uri: 'statistics:table:collection-52--679482285338238438',
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
        'block-manager': {
          'allocations requiring file extension': 538,
          'blocks allocated': 923,
          'blocks freed': 366,
          'checkpoint size': 15806464,
          'file allocation unit size': 4096,
          'file bytes available for reuse': 548864,
          'file magic number': 120897,
          'file major version number': 1,
          'file size in bytes': 16371712,
          'minor version number': 0
        },
        btree: {
          'btree checkpoint generation': 124,
          'btree clean tree checkpoint expiration time': Long('9223372036854775807'),
          'btree compact pages reviewed': 0,
          'btree compact pages rewritten': 0,
          'btree compact pages skipped': 0,
          'btree number of pages reconciled during checkpoint': 59,
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
          'bytes currently in the cache': 80798565,
          'bytes dirty in the cache cumulative': 16013203,
          'bytes read into cache': 20419284,
          'bytes written from cache': 94800804,
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
          'eviction walk pages seen that had updates': 247,
          'eviction walk pages seen that were clean': 1087,
          'eviction walk pages seen that were dirty': 47,
          'eviction walk passes of a file': 24,
          'eviction walk target pages histogram - 0-9': 0,
          'eviction walk target pages histogram - 10-31': 3,
          'eviction walk target pages histogram - 128 and higher': 0,
          'eviction walk target pages histogram - 32-63': 21,
          'eviction walk target pages histogram - 64-128': 0,
          'eviction walk target pages reduced due to history store cache pressure': 0,
          'eviction walks abandoned': 0,
          'eviction walks gave up because they restarted their walk twice': 24,
          'eviction walks gave up because they saw too many pages and found no candidates': 0,
          'eviction walks gave up because they saw too many pages and found too few candidates': 0,
          'eviction walks random search fails to locate a page, results in a null position': 0,
          'eviction walks reached end of tree': 48,
          'eviction walks restarted': 0,
          'eviction walks started from root of tree': 24,
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
          'in-memory page passed criteria to be split': 33,
          'in-memory page splits': 11,
          'internal page split blocked its eviction': 0,
          'internal pages evicted': 0,
          'internal pages split during eviction': 0,
          'leaf pages split during eviction': 16,
          'locate a random in-mem ref by examining all entries on the root page': 0,
          'modified pages evicted': 31,
          'multi-block reconciliation blocked whilst checkpoint is running': 0,
          'obsolete updates removed': 0,
          'overflow keys on a multiblock row-store page blocked its eviction': 0,
          'overflow pages read into cache': 0,
          'page split during eviction deepened the tree': 0,
          'page written requiring history store records': 0,
          'pages read into cache': 172,
          'pages read into cache after truncate': 0,
          'pages read into cache after truncate in prepare state': 0,
          'pages requested from the cache': 598911,
          'pages seen by eviction walk': 1417,
          'pages written from cache': 881,
          'pages written requiring in-memory restoration': 6,
          'recent modification of a page blocked its eviction': 0,
          'reverse splits performed': 0,
          'reverse splits skipped because of VLCS namespace gap restrictions': 0,
          'the number of times full update inserted to history store': 0,
          'the number of times reverse modify inserted to history store': 0,
          'tracked dirty bytes in the cache': 0,
          'tracked dirty internal page bytes in the cache': 0,
          'tracked dirty leaf page bytes in the cache': 0,
          'uncommitted truncate blocked page eviction': 0,
          'unmodified pages evicted': 8
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
        'checkpoint-cleanup': {
          'most recent duration on all eligible files (usecs)': 0,
          'most recent handles processed': 0,
          'pages added for eviction': 23,
          'pages removed': 24,
          'pages skipped during tree walk': 67,
          'pages visited': 2373
        },
        compression: {
          'compressed page maximum internal page size prior to compression': 4096,
          'compressed page maximum leaf page size prior to compression ': 131072,
          'compressed pages read': 172,
          'compressed pages written': 825,
          'number of blocks with compress ratio greater than 64': 0,
          'number of blocks with compress ratio smaller than 16': 0,
          'number of blocks with compress ratio smaller than 2': 0,
          'number of blocks with compress ratio smaller than 32': 0,
          'number of blocks with compress ratio smaller than 4': 154,
          'number of blocks with compress ratio smaller than 64': 0,
          'number of blocks with compress ratio smaller than 8': 18,
          'page written failed to compress': 0,
          'page written was too small to compress': 56
        },
        cursor: {
          'Total number of deleted pages skipped during tree walk': 368,
          'Total number of entries skipped by cursor next calls': 637002,
          'Total number of entries skipped by cursor prev calls': 0,
          'Total number of entries skipped to position the history store cursor': 0,
          'Total number of in-memory deleted pages skipped during tree walk': 515,
          'Total number of on-disk deleted pages skipped during tree walk': 0,
          'Total number of times a search near has exited due to prefix config': 0,
          'Total number of times cursor fails to temporarily release pinned page to encourage eviction of hot or large page': 0,
          'Total number of times cursor temporarily releases pinned page to encourage eviction of hot or large page': 0,
          'bulk loaded cursor insert calls': 0,
          'cache cursors reuse count': 275811,
          'close calls that result in cache': 275816,
          'create calls': 42,
          'cursor bound calls that return an error': 0,
          'cursor bounds cleared from reset': 0,
          'cursor bounds comparisons performed': 0,
          'cursor bounds next called on an unpositioned cursor': 0,
          'cursor bounds next early exit': 0,
          'cursor bounds prev called on an unpositioned cursor': 0,
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
          'cursor next calls that skip greater than 1 and fewer than 100 entries': 0,
          'cursor next calls that skip greater than or equal to 100 entries': 144,
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
          'insert calls': 535424,
          'insert key and value bytes': 51593213,
          modify: 0,
          'modify key and value bytes affected': 0,
          'modify value bytes modified': 0,
          'next calls': 7554938,
          'open cursor count': 0,
          'operation restarted': 212,
          'prev calls': 1,
          'remove calls': 35371,
          'remove key bytes removed': 97539,
          'reserve calls': 0,
          'reset calls': 616879,
          'search calls': 73310,
          'search history store calls': 0,
          'search near calls': 10068,
          'truncate calls': 0,
          'update calls': 0,
          'update key and value bytes': 0,
          'update value size change': 0
        },
        reconciliation: {
          'VLCS pages explicitly reconciled as empty': 0,
          'approximate byte size of timestamps in pages written': 13808352,
          'approximate byte size of transaction IDs in pages written': 6904176,
          'cursor next/prev calls during HS wrapup search_near': 0,
          'dictionary matches': 0,
          'fast-path pages deleted': 0,
          'internal page key bytes discarded using suffix compression': 1598,
          'internal page multi-block writes': 10,
          'leaf page key bytes discarded using prefix compression': 0,
          'leaf page multi-block writes': 39,
          'leaf-page overflow keys': 0,
          'maximum blocks required for a page': 1,
          'overflow values written': 0,
          'page reconciliation calls': 75,
          'page reconciliation calls for eviction': 6,
          'pages deleted': 0,
          'pages written including an aggregated newest start durable timestamp ': 46,
          'pages written including an aggregated newest stop durable timestamp ': 29,
          'pages written including an aggregated newest stop timestamp ': 16,
          'pages written including an aggregated newest stop transaction ID': 16,
          'pages written including an aggregated newest transaction ID ': 46,
          'pages written including an aggregated oldest start timestamp ': 46,
          'pages written including an aggregated prepare': 0,
          'pages written including at least one prepare': 0,
          'pages written including at least one start durable timestamp': 781,
          'pages written including at least one start timestamp': 781,
          'pages written including at least one start transaction ID': 781,
          'pages written including at least one stop durable timestamp': 72,
          'pages written including at least one stop timestamp': 72,
          'pages written including at least one stop transaction ID': 72,
          'records written including a prepare': 0,
          'records written including a start durable timestamp': 800116,
          'records written including a start timestamp': 800116,
          'records written including a start transaction ID': 800116,
          'records written including a stop durable timestamp': 62906,
          'records written including a stop timestamp': 62906,
          'records written including a stop transaction ID': 62906
        },
        session: { 'object compaction': 0 },
        transaction: {
          'a reader raced with a prepared transaction commit and skipped an update or updates': 0,
          'checkpoint has acquired a snapshot for its transaction': 0,
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
          'transaction checkpoints due to obsolete pages': 0,
          'update conflicts': 0
        }
      },
      nindexes: 2,
      indexBuilds: [],
      totalIndexSize: 43573248,
      indexSizes: { _id_: 15339520, email_hashed: 28233728 },
      totalSize: 59944960,
      scaleFactor: 1
    }
  },
  sharded: true,
  size: 92777780,
  count: 1000000,
  numOrphanDocs: 0,
  storageSize: 33566720,
  totalIndexSize: 86388736,
  totalSize: 119955456,
  indexSizes: { _id_: 30183424, email_hashed: 56205312 },
  avgObjSize: 92,
  ns: 'indexpoc.users',
  nindexes: 2,
  scaleFactor: 1
}
[direct: mongos] indexpoc> db.users.countDocuments()
1000000
[direct: mongos] indexpoc> 

#### Key Stats from Your Output:
Metric	                  Value
Total Docs	            1,000,000
Shard                   1	500,053 (50.0%)
Shard                   2	499,947 (49.99%)
Chunks	                2 (1 per shard)
Avg Doc Size	          92 bytes
Total Size	            ~120 MB
Index: _id	            ~30 MB
Index: email_hashed	    ~56 MB

##### One-Liner for Interview:
"1 million documents sharded by hashed email. 500K on each shard. Equality finds any email in 0ms scanning 1 document. Range query scans all 1M documents because hash destroys alphabetical order."

*One-Liner ----> Hashed index converts email to a random 64-bit number. You can find exact matches instantly, but you lose all ordering — so range queries and sorting require full collection scans. It's a tradeoff: fast point lookups, zero range support.*

###### Cleanup:
docker-compose down -v



# Geospatial Indexed:
------------------------------
## First Understand The Difference
### 2D Index

Uses:
Flat Map
X,Y Coordinates

Example:
{
  x: 10,
  y: 20
}

Used for:
Game maps
Canvas
Drawing apps
Coordinate systems

### 2DSphere Index

Uses:
Real Earth
Latitude
Longitude

Example:
{
  type: "Point",
  coordinates: [80.2707, 13.0827]
}

Used for:
Uber
Swiggy
Zomato
Google Maps
Nearby Stores
Delivery Tracking
* This is what companies actually use.

## Important GeoJSON Format
Mongo requires:
{
   type:"Point",
   coordinates:[
      longitude,
      latitude
   ]
}
NOT:
[latitude, longitude]
Wrong:
[13.0827,80.2707]
Correct:
[80.2707,13.0827]

## Steps:
1. Connect:
mongosh --port 27017
2. Seed Data First:
node seed-locations.js
3. TEST WITHOUT INDEX (See COLLSCAN):
*Terminal logs*:
*$near → REQUIRES index (no COLLSCAN possible)*
geopoc> db.locations.getIndexes()
[ { v: 2, key: { _id: 1 }, name: '_id_' } ]
geopoc> db.locations.find({
|     location: {
|         $near: {
|             $geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
|             $maxDistance: 1000
|         }
|     }
| }).explain("executionStats")
Uncaught:
MongoServerError[NoQueryExecutionPlans]: error processing query: ns=geopoc.locationsTree: GEONEAR  field=location maxdist=1000 isNearSphere=0
Sort: {}
Proj: {}
 planner returned error :: caused by :: unable to find index for $geoNear query
 * MongoDB WON'T do COLLSCAN for $near! It REQUIRES a 2dsphere or 2d index.
 *$geoWithin → Can COLLSCAN without index*:
 geopoc> db.locations.find({
|     location: {
|         $geoWithin: {
|             $geometry: {
|                 type: "Polygon",
|                 coordinates: [[
|                     [-74.02, 40.70],
|                     [-73.98, 40.70],
|                     [-73.98, 40.73],
|                     [-74.02, 40.73],
|                     [-74.02, 40.70]
|                 ]]
|             }
|         }
|     }
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'geopoc.locations',
    parsedQuery: {
      location: {
        '$geoWithin': {
          '$geometry': {
            type: 'Polygon',
            coordinates: [
              [
                [ -74.02, 40.7 ],
                [ -73.98, 40.7 ],
                [ -73.98, 40.73 ],
                [ -74.02, 40.73 ],
                [ -74.02, 40.7 ]
              ]
            ]
          }
        }
      }
    },
    indexFilterSet: false,
    queryHash: '60E7A84A',
    planCacheShapeHash: '60E7A84A',
    planCacheKey: '263DA89C',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: {
        location: {
          '$geoWithin': {
            '$geometry': {
              type: 'Polygon',
              coordinates: [
                [
                  [ -74.02, 40.7 ],
                  [ -73.98, 40.7 ],
                  [ -73.98, 40.73 ],
                  [ -74.02, 40.73 ],
                  [ -74.02, 40.7 ]
                ]
              ]
            }
          }
        }
      },
      direction: 'forward'
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 264,
    executionTimeMillis: 27,
    totalKeysExamined: 0,
    totalDocsExamined: 10000,
    executionStages: {
      isCached: false,
      stage: 'COLLSCAN',
      filter: {
        location: {
          '$geoWithin': {
            '$geometry': {
              type: 'Polygon',
              coordinates: [
                [
                  [ -74.02, 40.7 ],
                  [ -73.98, 40.7 ],
                  [ -73.98, 40.73 ],
                  [ -74.02, 40.73 ],
                  [ -74.02, 40.7 ]
                ]
              ]
            }
          }
        }
      },
      nReturned: 264,
      executionTimeMillisEstimate: 12,
      works: 10001,
      advanced: 264,
      needTime: 9736,
      needYield: 0,
      saveState: 1,
      restoreState: 1,
      isEOF: 1,
      direction: 'forward',
      docsExamined: 10000
    }
  },
  queryShapeHash: '0F1EF551224AF7662521C543A3098A87744A7591EA982A347A4FABC837508B52',
  command: {
    find: 'locations',
    filter: {
      location: {
        '$geoWithin': {
          '$geometry': {
            type: 'Polygon',
            coordinates: [
              [
                [ -74.02, 40.7 ],
                [ -73.98, 40.7 ],
                [ -73.98, 40.73 ],
                [ -74.02, 40.73 ],
                [ -74.02, 40.7 ]
              ]
            ]
          }
        }
      }
    },
    '$db': 'geopoc'
  },
  serverInfo: {
    host: '8cffffaef5f4',
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
geopoc> 
4. Create Index:
geopoc> db.locations.createIndex({ location: "2dsphere" })
location_2dsphere
*With Index → $geoWithin (IXSCAN)*:
geopoc> db.locations.find({
|     location: {
|         $geoWithin: {
|             $geometry: {
|                 type: "Polygon",
|                 coordinates: [[
|                     [-74.02, 40.70],
|                     [-73.98, 40.70],
|                     [-73.98, 40.73],
|                     [-74.02, 40.73],
|                     [-74.02, 40.70]
|                 ]]
|             }
|         }
|     }
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'geopoc.locations',
    parsedQuery: {
      location: {
        '$geoWithin': {
          '$geometry': {
            type: 'Polygon',
            coordinates: [
              [
                [ -74.02, 40.7 ],
                [ -73.98, 40.7 ],
                [ -73.98, 40.73 ],
                [ -74.02, 40.73 ],
                [ -74.02, 40.7 ]
              ]
            ]
          }
        }
      }
    },
    indexFilterSet: false,
    queryHash: '60E7A84A',
    planCacheShapeHash: '60E7A84A',
    planCacheKey: '90123B03',
    optimizationTimeMillis: 1,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'FETCH',
      filter: {
        location: {
          '$geoWithin': {
            '$geometry': {
              type: 'Polygon',
              coordinates: [
                [
                  [ -74.02, 40.7 ],
                  [ -73.98, 40.7 ],
                  [ -73.98, 40.73 ],
                  [ -74.02, 40.73 ],
                  [ -74.02, 40.7 ]
                ]
              ]
            }
          }
        }
      },
      inputStage: {
        stage: 'IXSCAN',
        keyPattern: { location: '2dsphere' },
        indexName: 'location_2dsphere',
        isMultiKey: false,
        multiKeyPaths: { location: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          location: [
            '[-8574853690513424384, -8574853690513424384]',
            '[-8520810494984978432, -8520810494984978432]',
            '[-8520177176287379456, -8520177176287379456]',
            '[-8520159584101335040, -8520159584101335040]',
            '[-8520149688496685056, -8520149688496685056]',
            '[-8520149413618778112, -8520149413618778112]',
            '[-8520149207460347904, -8520149207460347904]',
            '[-8520149190280478720, -8520149190280478720]',
            '[-8520149190280478719, -8520149181690544129]',
            '[-8520149181690544127, -8520149173100609537]',
            '[-8520149173100609535, -8520149138740871169]',
            '[-8520149138740871167, -8520149001301917697]',
            '[-8520148863862964224, -8520148863862964224]',
            '[-8520148692064272383, -8520148657704534017]',
            '[-8520148657704534016, -8520148657704534016]',
            '[-8520148657704534015, -8520148623344795649]',
            '[-8520148623344795647, -8520148614754861057]',
            '[-8520148614754861055, -8520148606164926465]',
            '[-8520148606164926464, -8520148606164926464]',
            '[-8520148588985057279, -8520148451546103809]',
            '[-8520148451546103807, -8520148314107150337]',
            '[-8520148314107150336, -8520148314107150336]',
            '[-8520148125128589312, -8520148125128589312]',
            '[-8520148125128589311, -8520148116538654721]',
            '[-8520148107948720128, -8520148107948720128]',
            '[-8520148097211301887, -8520148095063818241]',
            '[-8520148095063818240, -8520148095063818240]',
            '[-8520148090768850944, -8520148090768850944]',
            '[-8520147489473429504, -8520147489473429504]',
            '[-8520146664839708672, -8520146664839708672]',
            '[-8520146630479970303, -8520146596120231937]',
            '[-8520146596120231936, -8520146596120231936]',
            '[-8520146596120231935, -8520146561760493569]',
            '[-8520146389961801728, -8520146389961801728]',
            '[-8519966070054846464, -8519966070054846464]',
            '[-8519684595078135808, -8519684595078135808]',
            '[-8516306895357607936, -8516306895357607936]'
          ]
        }
      }
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 264,
    executionTimeMillis: 4,
    totalKeysExamined: 491,
    totalDocsExamined: 476,
    executionStages: {
      isCached: false,
      stage: 'FETCH',
      filter: {
        location: {
          '$geoWithin': {
            '$geometry': {
              type: 'Polygon',
              coordinates: [
                [
                  [ -74.02, 40.7 ],
                  [ -73.98, 40.7 ],
                  [ -73.98, 40.73 ],
                  [ -74.02, 40.73 ],
                  [ -74.02, 40.7 ]
                ]
              ]
            }
          }
        }
      },
      nReturned: 264,
      executionTimeMillisEstimate: 0,
      works: 492,
      advanced: 264,
      needTime: 227,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      docsExamined: 476,
      alreadyHasObj: 0,
      inputStage: {
        stage: 'IXSCAN',
        nReturned: 476,
        executionTimeMillisEstimate: 0,
        works: 492,
        advanced: 476,
        needTime: 15,
        needYield: 0,
        saveState: 0,
        restoreState: 0,
        isEOF: 1,
        keyPattern: { location: '2dsphere' },
        indexName: 'location_2dsphere',
        isMultiKey: false,
        multiKeyPaths: { location: [] },
        isUnique: false,
        isSparse: false,
        isPartial: false,
        indexVersion: 2,
        direction: 'forward',
        indexBounds: {
          location: [
            '[-8574853690513424384, -8574853690513424384]',
            '[-8520810494984978432, -8520810494984978432]',
            '[-8520177176287379456, -8520177176287379456]',
            '[-8520159584101335040, -8520159584101335040]',
            '[-8520149688496685056, -8520149688496685056]',
            '[-8520149413618778112, -8520149413618778112]',
            '[-8520149207460347904, -8520149207460347904]',
            '[-8520149190280478720, -8520149190280478720]',
            '[-8520149190280478719, -8520149181690544129]',
            '[-8520149181690544127, -8520149173100609537]',
            '[-8520149173100609535, -8520149138740871169]',
            '[-8520149138740871167, -8520149001301917697]',
            '[-8520148863862964224, -8520148863862964224]',
            '[-8520148692064272383, -8520148657704534017]',
            '[-8520148657704534016, -8520148657704534016]',
            '[-8520148657704534015, -8520148623344795649]',
            '[-8520148623344795647, -8520148614754861057]',
            '[-8520148614754861055, -8520148606164926465]',
            '[-8520148606164926464, -8520148606164926464]',
            '[-8520148588985057279, -8520148451546103809]',
            '[-8520148451546103807, -8520148314107150337]',
            '[-8520148314107150336, -8520148314107150336]',
            '[-8520148125128589312, -8520148125128589312]',
            '[-8520148125128589311, -8520148116538654721]',
            '[-8520148107948720128, -8520148107948720128]',
            '[-8520148097211301887, -8520148095063818241]',
            '[-8520148095063818240, -8520148095063818240]',
            '[-8520148090768850944, -8520148090768850944]',
            '[-8520147489473429504, -8520147489473429504]',
            '[-8520146664839708672, -8520146664839708672]',
            '[-8520146630479970303, -8520146596120231937]',
            '[-8520146596120231936, -8520146596120231936]',
            '[-8520146596120231935, -8520146561760493569]',
            '[-8520146389961801728, -8520146389961801728]',
            '[-8519966070054846464, -8519966070054846464]',
            '[-8519684595078135808, -8519684595078135808]',
            '[-8516306895357607936, -8516306895357607936]'
          ]
        },
        keysExamined: 491,
        seeks: 16,
        dupsTested: 0,
        dupsDropped: 0
      }
    }
  },
  queryShapeHash: '0F1EF551224AF7662521C543A3098A87744A7591EA982A347A4FABC837508B52',
  command: {
    find: 'locations',
    filter: {
      location: {
        '$geoWithin': {
          '$geometry': {
            type: 'Polygon',
            coordinates: [
              [
                [ -74.02, 40.7 ],
                [ -73.98, 40.7 ],
                [ -73.98, 40.73 ],
                [ -74.02, 40.73 ],
                [ -74.02, 40.7 ]
              ]
            ]
          }
        }
      }
    },
    '$db': 'geopoc'
  },
  serverInfo: {
    host: '8cffffaef5f4',
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
geopoc> 
*$near NOW works (with index)*:
geopoc> db.locations.find({
|     location: {
|         $near: {
|             $geometry: { type: "Point", coordinates: [-74.006, 40.7128] },
|             $maxDistance: 1000
|         }
|     }
| }).explain("executionStats")
{
  explainVersion: '1',
  queryPlanner: {
    namespace: 'geopoc.locations',
    parsedQuery: {
      location: {
        '$near': {
          '$geometry': { type: 'Point', coordinates: [ -74.006, 40.7128 ] },
          '$maxDistance': 1000
        }
      }
    },
    indexFilterSet: false,
    queryHash: 'AF055757',
    planCacheShapeHash: 'AF055757',
    planCacheKey: '879EFB9A',
    optimizationTimeMillis: 0,
    maxIndexedOrSolutionsReached: false,
    maxIndexedAndSolutionsReached: false,
    maxScansToExplodeReached: false,
    prunedSimilarIndexes: false,
    winningPlan: {
      isCached: false,
      stage: 'GEO_NEAR_2DSPHERE',                                             -->*// ✅ Geospatial index*
      keyPattern: { location: '2dsphere' },
      indexName: 'location_2dsphere',
      indexVersion: 2,
      inputStages: [
        {
          stage: 'FETCH',
          inputStage: {
            stage: 'IXSCAN',
            keyPattern: { location: '2dsphere' },
            indexName: 'location_2dsphere',
            isMultiKey: false,
            multiKeyPaths: { location: [] },
            isUnique: false,
            isSparse: false,
            isPartial: false,
            indexVersion: 2,
            direction: 'forward',
            indexBounds: {
              location: [
                '[-8574853690513424384, -8574853690513424384]',
                '[-8520810494984978432, -8520810494984978432]',
                '[-8520177176287379456, -8520177176287379456]',
                '[-8520159584101335040, -8520159584101335040]',
                '[-8520148520265580544, -8520148520265580544]',
                '[-8520148503085711360, -8520148503085711360]',
                '[-8520148490200809472, -8520148490200809472]',
                '[-8520148486979584000, -8520148486979584000]',
                '[-8520148486442713087, -8520148485905842177]',
                '[-8520148485905842175, -8520148483758358529]',
                '[-8520148483758358527, -8520148481610874881]',
                '[-8520148481610874880, -8520148481610874880]',
                '[-8520148481610874879, -8520148479463391233]',
                '[-8520148479194955776, -8520148479194955776]',
                '[-8520148478993629184, -8520148478993629184]',
                '[-8520148478960074751, -8520148478926520321]',
                '[-8520148478926520319, -8520148478389649409]',
                '[-8520148478389649408, -8520148478389649408]',
                '[-8520148478389649407, -8520148477852778497]',
                '[-8520148468725972992, -8520148468725972992]',
                '[-8520148456914812928, -8520148456914812928]',
                '[-8520148456914812927, -8520148456377942017]',
                '[-8520148455841071104, -8520148455841071104]',
                '[-8520148455841071103, -8520148453693587457]',
                '[-8520148453693587455, -8520148453559369729]',
                '[-8520148453425152000, -8520148453425152000]',
                '[-8520148452619845632, -8520148452619845632]',
                '[-8520148451009232895, -8520148450472361985]',
                '[-8520148450472361984, -8520148450472361984]',
                '[-8520148450472361983, -8520148449935491073]',
                '[-8520148448324878336, -8520148448324878336]',
                '[-8520148447519571968, -8520148447519571968]',
                '[-8520148447385354239, -8520148447251136513]',
                '[-8520148447251136512, -8520148447251136512]',
                '[-8520148447251136511, -8520148445103652865]',
                '[-8520148445103652863, -8520148442956169217]',
                '[-8520148442956169215, -8520148434366234625]',
                '[-8520148434366234624, -8520148434366234624]',
                '[-8520148382826627072, -8520148382826627072]',
                '[-8520148331287019520, -8520148331287019520]',
                '[-8520148326992052224, -8520148326992052224]',
                '[-8520148325918310400, -8520148325918310400]',
                '[-8520148325649874944, -8520148325649874944]',
                '[-8520148325582766080, -8520148325582766080]',
                '[-8520148325582766079, -8520148325549211649]',
                '[-8520148314107150336, -8520148314107150336]',
                '[-8520147489473429504, -8520147489473429504]',
                '[-8520146389961801728, -8520146389961801728]',
                '[-8519966070054846464, -8519966070054846464]',
                '[-8519684595078135808, -8519684595078135808]',
                '[-8516306895357607936, -8516306895357607936]'
              ]
            }
          }
        },
        {
          stage: 'FETCH',
          inputStage: {
            stage: 'IXSCAN',
            keyPattern: { location: '2dsphere' },
            indexName: 'location_2dsphere',
            isMultiKey: false,
            multiKeyPaths: { location: [] },
            isUnique: false,
            isSparse: false,
            isPartial: false,
            indexVersion: 2,
            direction: 'forward',
            indexBounds: {
              location: [
                '[-8574853690513424384, -8574853690513424384]',
                '[-8520810494984978432, -8520810494984978432]',
                '[-8520177176287379456, -8520177176287379456]',
                '[-8520159584101335040, -8520159584101335040]',
                '[-8520149688496685056, -8520149688496685056]',
                '[-8520149104381132799, -8520149095791198209]',
                '[-8520149095791198207, -8520149087201263617]',
                '[-8520149087201263616, -8520149087201263616]',
                '[-8520149070021394432, -8520149070021394432]',
                '[-8520148863862964224, -8520148863862964224]',
                '[-8520148657704534016, -8520148657704534016]',
                '[-8520148640524664832, -8520148640524664832]',
                '[-8520148640524664831, -8520148631934730241]',
                '[-8520148631934730239, -8520148631397859329]',
                '[-8520148630860988416, -8520148630860988416]',
                '[-8520148627639762944, -8520148627639762944]',
                '[-8520148520265580544, -8520148520265580544]',
                '[-8520148520265580543, -8520148511675645953]',
                '[-8520148503085711360, -8520148503085711360]',
                '[-8520148503085711359, -8520148494495776769]',
                '[-8520148494495776767, -8520148492348293121]',
                '[-8520148492348293119, -8520148490200809473]',
                '[-8520148490200809472, -8520148490200809472]',
                '[-8520148490200809471, -8520148488053325825]',
                '[-8520148488053325823, -8520148487516454913]',
                '[-8520148487516454911, -8520148486979584001]',
                '[-8520148486979584000, -8520148486979584000]',
                '[-8520148486979583999, -8520148486442713089]',
                '[-8520148481610874880, -8520148481610874880]',
                '[-8520148479463391231, -8520148479329173505]',
                '[-8520148479329173503, -8520148479194955777]',
                '[-8520148479194955776, -8520148479194955776]',
                '[-8520148479194955775, -8520148479060738049]',
                '[-8520148479060738047, -8520148479027183617]',
                '[-8520148479027183615, -8520148478993629185]',
                '[-8520148478993629184, -8520148478993629184]',
                '[-8520148478993629183, -8520148478960074753]',
                '[-8520148478389649408, -8520148478389649408]',
                '[-8520148477852778495, -8520148477315907585]',
                '[-8520148477315907583, -8520148468725972993]',
                '[-8520148468725972992, -8520148468725972992]',
                '[-8520148468725972991, -8520148460136038401]',
                '[-8520148460136038399, -8520148457988554753]',
                '[-8520148457988554751, -8520148457451683841]',
                '[-8520148457451683839, -8520148456914812929]',
                '[-8520148456914812928, -8520148456914812928]',
                '[-8520148456377942015, -8520148455841071105]',
                '[-8520148455841071104, -8520148455841071104]',
                '[-8520148453559369727, -8520148453425152001]',
                '[-8520148453425152000, -8520148453425152000]',
                '[-8520148453425151999, -8520148453290934273]',
                '[-8520148453290934271, -8520148453156716545]',
                '[-8520148453156716543, -8520148452619845633]',
                '[-8520148452619845632, -8520148452619845632]',
                '[-8520148452619845631, -8520148452082974721]',
                '[-8520148452082974719, -8520148451546103809]',
                '[-8520148451546103807, -8520148451009232897]',
                '[-8520148450472361984, -8520148450472361984]',
                '[-8520148449935491071, -8520148449398620161]',
                '[-8520148449398620159, -8520148448861749249]',
                '[-8520148448861749247, -8520148448324878337]',
                '[-8520148448324878336, -8520148448324878336]',
                '[-8520148448324878335, -8520148447788007425]',
                '[-8520148447788007423, -8520148447653789697]',
                '[-8520148447653789695, -8520148447519571969]',
                '[-8520148447519571968, -8520148447519571968]',
                '[-8520148447519571967, -8520148447385354241]',
                '[-8520148447251136512, -8520148447251136512]',
                '[-8520148434366234624, -8520148434366234624]',
                '[-8520148434366234623, -8520148425776300033]',
                '[-8520148425776300031, -8520148417186365441]',
                '[-8520148417186365439, -8520148408596430849]',
                '[-8520148400006496256, -8520148400006496256]',
                '[-8520148387121594368, -8520148387121594368]',
                '[-8520148387121594367, -8520148384974110721]',
                '[-8520148382826627072, -8520148382826627072]',
                '[-8520148339876954111, -8520148331287019521]',
                '[-8520148331287019520, -8520148331287019520]',
                '[-8520148331287019519, -8520148329139535873]',
                '[-8520148329139535871, -8520148326992052225]',
                '[-8520148326992052224, -8520148326992052224]',
                '[-8520148326992052223, -8520148326455181313]',
                '[-8520148326455181311, -8520148325918310401]',
                '[-8520148325918310400, -8520148325918310400]',
                '[-8520148325918310399, -8520148325784092673]',
                '[-8520148325784092671, -8520148325649874945]',
                '[-8520148325649874944, -8520148325649874944]',
                '[-8520148325649874943, -8520148325616320513]',
                '[-8520148325616320511, -8520148325582766081]',
                '[-8520148325582766080, -8520148325582766080]',
                '[-8520148325549211647, -8520148325515657217]',
                '[-8520148325515657215, -8520148325381439489]',
                '[-8520148325381439487, -8520148324844568577]',
                '[-8520148324844568575, -8520148322697084929]',
                '[-8520148322697084927, -8520148320549601281]',
                '[-8520148318402117632, -8520148318402117632]',
                '[-8520148314107150336, -8520148314107150336]',
                '[-8520147489473429504, -8520147489473429504]',
                '[-8520146389961801728, -8520146389961801728]',
                '[-8519966070054846464, -8519966070054846464]',
                '[-8519684595078135808, -8519684595078135808]',
                '[-8516306895357607936, -8516306895357607936]'
              ]
            }
          }
        }
      ]
    },
    rejectedPlans: []
  },
  executionStats: {
    executionSuccess: true,
    nReturned: 69,
    executionTimeMillis: 2,
    totalKeysExamined: 135,
    totalDocsExamined: 96,                                                                --->*// ✅ Only nearby*
    executionStages: {
      isCached: false,
      stage: 'GEO_NEAR_2DSPHERE',
      nReturned: 69,
      executionTimeMillisEstimate: 0,
      works: 219,
      advanced: 69,
      needTime: 149,
      needYield: 0,
      saveState: 0,
      restoreState: 0,
      isEOF: 1,
      keyPattern: { location: '2dsphere' },
      indexName: 'location_2dsphere',
      indexVersion: 2,
      searchIntervals: [
        {
          minDistance: 0,
          maxDistance: 426.04116191826887,
          maxInclusive: false,
          nBuffered: 21,
          nReturned: 17
        },
        {
          minDistance: 426.04116191826887,
          maxDistance: 1000,
          maxInclusive: true,
          nBuffered: 75,
          nReturned: 52
        }
      ],
      inputStages: [
        {
          stage: 'FETCH',
          nReturned: 21,
          executionTimeMillisEstimate: 0,
          works: 40,
          advanced: 21,
          needTime: 18,
          needYield: 0,
          saveState: 0,
          restoreState: 0,
          isEOF: 1,
          docsExamined: 21,
          alreadyHasObj: 0,
          inputStage: {
            stage: 'IXSCAN',
            nReturned: 21,
            executionTimeMillisEstimate: 0,
            works: 40,
            advanced: 21,
            needTime: 18,
            needYield: 0,
            saveState: 0,
            restoreState: 0,
            isEOF: 1,
            keyPattern: { location: '2dsphere' },
            indexName: 'location_2dsphere',
            isMultiKey: false,
            multiKeyPaths: { location: [] },
            isUnique: false,
            isSparse: false,
            isPartial: false,
            indexVersion: 2,
            direction: 'forward',
            indexBounds: {
              location: [
                '[-8574853690513424384, -8574853690513424384]',
                '[-8520810494984978432, -8520810494984978432]',
                '[-8520177176287379456, -8520177176287379456]',
                '[-8520159584101335040, -8520159584101335040]',
                '[-8520148520265580544, -8520148520265580544]',
                '[-8520148503085711360, -8520148503085711360]',
                '[-8520148490200809472, -8520148490200809472]',
                '[-8520148486979584000, -8520148486979584000]',
                '[-8520148486442713087, -8520148485905842177]',
                '[-8520148485905842175, -8520148483758358529]',
                '[-8520148483758358527, -8520148481610874881]',
                '[-8520148481610874880, -8520148481610874880]',
                '[-8520148481610874879, -8520148479463391233]',
                '[-8520148479194955776, -8520148479194955776]',
                '[-8520148478993629184, -8520148478993629184]',
                '[-8520148478960074751, -8520148478926520321]',
                '[-8520148478926520319, -8520148478389649409]',
                '[-8520148478389649408, -8520148478389649408]',
                '[-8520148478389649407, -8520148477852778497]',
                '[-8520148468725972992, -8520148468725972992]',
                '[-8520148456914812928, -8520148456914812928]',
                '[-8520148456914812927, -8520148456377942017]',
                '[-8520148455841071104, -8520148455841071104]',
                '[-8520148455841071103, -8520148453693587457]',
                '[-8520148453693587455, -8520148453559369729]',
                '[-8520148453425152000, -8520148453425152000]',
                '[-8520148452619845632, -8520148452619845632]',
                '[-8520148451009232895, -8520148450472361985]',
                '[-8520148450472361984, -8520148450472361984]',
                '[-8520148450472361983, -8520148449935491073]',
                '[-8520148448324878336, -8520148448324878336]',
                '[-8520148447519571968, -8520148447519571968]',
                '[-8520148447385354239, -8520148447251136513]',
                '[-8520148447251136512, -8520148447251136512]',
                '[-8520148447251136511, -8520148445103652865]',
                '[-8520148445103652863, -8520148442956169217]',
                '[-8520148442956169215, -8520148434366234625]',
                '[-8520148434366234624, -8520148434366234624]',
                '[-8520148382826627072, -8520148382826627072]',
                '[-8520148331287019520, -8520148331287019520]',
                '[-8520148326992052224, -8520148326992052224]',
                '[-8520148325918310400, -8520148325918310400]',
                '[-8520148325649874944, -8520148325649874944]',
                '[-8520148325582766080, -8520148325582766080]',
                '[-8520148325582766079, -8520148325549211649]',
                '[-8520148314107150336, -8520148314107150336]',
                '[-8520147489473429504, -8520147489473429504]',
                '[-8520146389961801728, -8520146389961801728]',
                '[-8519966070054846464, -8519966070054846464]',
                '[-8519684595078135808, -8519684595078135808]',
                '[-8516306895357607936, -8516306895357607936]'
              ]
            },
            keysExamined: 39,
            seeks: 19,
            dupsTested: 0,
            dupsDropped: 0
          }
        },
        {
          stage: 'FETCH',
          nReturned: 75,
          executionTimeMillisEstimate: 0,
          works: 97,
          advanced: 75,
          needTime: 21,
          needYield: 0,
          saveState: 0,
          restoreState: 0,
          isEOF: 1,
          docsExamined: 75,
          alreadyHasObj: 0,
          inputStage: {
            stage: 'IXSCAN',
            nReturned: 75,
            executionTimeMillisEstimate: 0,
            works: 97,
            advanced: 75,
            needTime: 21,
            needYield: 0,
            saveState: 0,
            restoreState: 0,
            isEOF: 1,
            keyPattern: { location: '2dsphere' },
            indexName: 'location_2dsphere',
            isMultiKey: false,
            multiKeyPaths: { location: [] },
            isUnique: false,
            isSparse: false,
            isPartial: false,
            indexVersion: 2,
            direction: 'forward',
            indexBounds: {
              location: [
                '[-8574853690513424384, -8574853690513424384]',
                '[-8520810494984978432, -8520810494984978432]',
                '[-8520177176287379456, -8520177176287379456]',
                '[-8520159584101335040, -8520159584101335040]',
                '[-8520149688496685056, -8520149688496685056]',
                '[-8520149104381132799, -8520149095791198209]',
                '[-8520149095791198207, -8520149087201263617]',
                '[-8520149087201263616, -8520149087201263616]',
                '[-8520149070021394432, -8520149070021394432]',
                '[-8520148863862964224, -8520148863862964224]',
                '[-8520148657704534016, -8520148657704534016]',
                '[-8520148640524664832, -8520148640524664832]',
                '[-8520148640524664831, -8520148631934730241]',
                '[-8520148631934730239, -8520148631397859329]',
                '[-8520148630860988416, -8520148630860988416]',
                '[-8520148627639762944, -8520148627639762944]',
                '[-8520148520265580544, -8520148520265580544]',
                '[-8520148520265580543, -8520148511675645953]',
                '[-8520148503085711360, -8520148503085711360]',
                '[-8520148503085711359, -8520148494495776769]',
                '[-8520148494495776767, -8520148492348293121]',
                '[-8520148492348293119, -8520148490200809473]',
                '[-8520148490200809472, -8520148490200809472]',
                '[-8520148490200809471, -8520148488053325825]',
                '[-8520148488053325823, -8520148487516454913]',
                '[-8520148487516454911, -8520148486979584001]',
                '[-8520148486979584000, -8520148486979584000]',
                '[-8520148486979583999, -8520148486442713089]',
                '[-8520148481610874880, -8520148481610874880]',
                '[-8520148479463391231, -8520148479329173505]',
                '[-8520148479329173503, -8520148479194955777]',
                '[-8520148479194955776, -8520148479194955776]',
                '[-8520148479194955775, -8520148479060738049]',
                '[-8520148479060738047, -8520148479027183617]',
                '[-8520148479027183615, -8520148478993629185]',
                '[-8520148478993629184, -8520148478993629184]',
                '[-8520148478993629183, -8520148478960074753]',
                '[-8520148478389649408, -8520148478389649408]',
                '[-8520148477852778495, -8520148477315907585]',
                '[-8520148477315907583, -8520148468725972993]',
                '[-8520148468725972992, -8520148468725972992]',
                '[-8520148468725972991, -8520148460136038401]',
                '[-8520148460136038399, -8520148457988554753]',
                '[-8520148457988554751, -8520148457451683841]',
                '[-8520148457451683839, -8520148456914812929]',
                '[-8520148456914812928, -8520148456914812928]',
                '[-8520148456377942015, -8520148455841071105]',
                '[-8520148455841071104, -8520148455841071104]',
                '[-8520148453559369727, -8520148453425152001]',
                '[-8520148453425152000, -8520148453425152000]',
                '[-8520148453425151999, -8520148453290934273]',
                '[-8520148453290934271, -8520148453156716545]',
                '[-8520148453156716543, -8520148452619845633]',
                '[-8520148452619845632, -8520148452619845632]',
                '[-8520148452619845631, -8520148452082974721]',
                '[-8520148452082974719, -8520148451546103809]',
                '[-8520148451546103807, -8520148451009232897]',
                '[-8520148450472361984, -8520148450472361984]',
                '[-8520148449935491071, -8520148449398620161]',
                '[-8520148449398620159, -8520148448861749249]',
                '[-8520148448861749247, -8520148448324878337]',
                '[-8520148448324878336, -8520148448324878336]',
                '[-8520148448324878335, -8520148447788007425]',
                '[-8520148447788007423, -8520148447653789697]',
                '[-8520148447653789695, -8520148447519571969]',
                '[-8520148447519571968, -8520148447519571968]',
                '[-8520148447519571967, -8520148447385354241]',
                '[-8520148447251136512, -8520148447251136512]',
                '[-8520148434366234624, -8520148434366234624]',
                '[-8520148434366234623, -8520148425776300033]',
                '[-8520148425776300031, -8520148417186365441]',
                '[-8520148417186365439, -8520148408596430849]',
                '[-8520148400006496256, -8520148400006496256]',
                '[-8520148387121594368, -8520148387121594368]',
                '[-8520148387121594367, -8520148384974110721]',
                '[-8520148382826627072, -8520148382826627072]',
                '[-8520148339876954111, -8520148331287019521]',
                '[-8520148331287019520, -8520148331287019520]',
                '[-8520148331287019519, -8520148329139535873]',
                '[-8520148329139535871, -8520148326992052225]',
                '[-8520148326992052224, -8520148326992052224]',
                '[-8520148326992052223, -8520148326455181313]',
                '[-8520148326455181311, -8520148325918310401]',
                '[-8520148325918310400, -8520148325918310400]',
                '[-8520148325918310399, -8520148325784092673]',
                '[-8520148325784092671, -8520148325649874945]',
                '[-8520148325649874944, -8520148325649874944]',
                '[-8520148325649874943, -8520148325616320513]',
                '[-8520148325616320511, -8520148325582766081]',
                '[-8520148325582766080, -8520148325582766080]',
                '[-8520148325549211647, -8520148325515657217]',
                '[-8520148325515657215, -8520148325381439489]',
                '[-8520148325381439487, -8520148324844568577]',
                '[-8520148324844568575, -8520148322697084929]',
                '[-8520148322697084927, -8520148320549601281]',
                '[-8520148318402117632, -8520148318402117632]',
                '[-8520148314107150336, -8520148314107150336]',
                '[-8520147489473429504, -8520147489473429504]',
                '[-8520146389961801728, -8520146389961801728]',
                '[-8519966070054846464, -8519966070054846464]',
                '[-8519684595078135808, -8519684595078135808]',
                '[-8516306895357607936, -8516306895357607936]'
              ]
            },
            keysExamined: 96,
            seeks: 22,
            dupsTested: 0,
            dupsDropped: 0
          }
        }
      ]
    }
  },
  queryShapeHash: 'DE887DF8305400C28F13A09DCA0AD20B003536C238BECB1CBF8BDE744957CD57',
  command: {
    find: 'locations',
    filter: {
      location: {
        '$near': {
          '$geometry': { type: 'Point', coordinates: [ -74.006, 40.7128 ] },
          '$maxDistance': 1000
        }
      }
    },
    '$db': 'geopoc'
  },
  serverInfo: {
    host: '8cffffaef5f4',
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
geopoc> 


## Summary Table:
Query Type	          Without Index	         With 2dsphere Index
----------------    --------------------    ---------------------
$near	               ❌ ERROR (required)	    ✅ GEO_NEAR_2DSPHERE
$geoWithin	         ✅ COLLSCAN	            ✅ IXSCAN
$geoIntersects       ✅ COLLSCAN	            ✅ IXSCAN
$geoNear aggregate	 ❌ ERROR (required)	    ✅ GEO_NEAR_2DSPHERE

### Quick Reference Card:
Query	                   Purpose	                            Stage
$near	                  Find nearby, sorted by distance	   GEO_NEAR_2DSPHERE
$geoWithin	            Find inside polygon/circle	       IXSCAN
$geoIntersects	        Find crossing a line	             IXSCAN
$geoNear (aggregate)	  Like $near + distance field	       GEO_NEAR_2DSPHERE
$centerSphere	          Find within circle (miles)	       IXSCAN