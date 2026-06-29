// require("dotenv").config();
// console.log(process.env.MONGO_URI);

// const { MongoClient } = require("mongodb");

// async function start() {
//     const client = new MongoClient(process.env.MONGO_URI);

//     await client.connect();

//     console.log("✅ Connected");

//     const db = client.db("company");

//     const collection = db.collection("users");

//     console.log("👀 Listening for changes...");

//     const changeStream = collection.watch();

//     changeStream.on("change", (change) => {
//         console.log("--------------------------------");
//         console.log("New Change");
//         console.log(JSON.stringify(change, null, 2));
//     });
// }

// start();

const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.MONGO_URI);

async function start() {
  await client.connect();
  console.log("✅ Connected");

  const db = client.db("company");
  const collection = db.collection("users");

  const changeStream = collection.watch([], {
    fullDocument: "updateLookup"
  });

  console.log("👀 Listening for changes...");

  changeStream.on("change", (change) => {
    console.log("\n==============================");
    console.log("Operation :", change.operationType);

    switch (change.operationType) {
      case "insert":
        console.log("Inserted Document:");
        console.log(change.fullDocument);
        break;

      case "update":
        console.log("Updated Fields:");
        console.log(change.updateDescription.updatedFields);

        console.log("Complete Document:");
        console.log(change.fullDocument);
        break;

      case "replace":
        console.log("Replaced Document:");
        console.log(change.fullDocument);
        break;

      case "delete":
        console.log("Deleted Document Id:");
        console.log(change.documentKey);
        break;

      default:
        console.log(change);
    }
  });
}

start();

// Flow of Change Streams:-
// -----------------------
// Application
//       │
//       │ insert/update/delete
//       ▼
// MongoDB Collection
//       │
//       │ Change occurs
//       ▼
// MongoDB writes the operation to the Oplog
//       │
//       ▼
// Change Stream watches the Oplog
//       │
//       ▼
// collection.watch() receives the change event
//       │
//       ▼
// Your Node.js application gets the event
//       │
//       ▼
// You can log it, send a WebSocket event, send an email, etc.

// Suppose someone runs:
// db.users.insertOne({
//     name: "John"
// });

// MongoDB internally:
// ✅ Inserts the document.
// ✅ Records the operation in the Oplog.
// ✅ The Change Stream reads the Oplog entry.
// ✅ collection.watch() emits a "change" event.
// ✅ Your application receives the change object.