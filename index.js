const { MongoClient } = require("mongodb");
// Connection URI
const uri = "mongodb://127.0.0.1:27017";
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    let res = await client
      .db("test")
      .collection('inventory')
      .find({item:"journal"})
    console.log(await res.toArray())
  } catch (err) {
    console.log('Connect failed')
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run()
