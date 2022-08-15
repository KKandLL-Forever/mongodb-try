import { MongoClient, ObjectId } from "mongodb";

const connectUri = 'mongodb+srv://claywang:52011992wk@socialmedia.noehqeg.mongodb.net/?retryWrites=true&w=majority'
const mongo = new MongoClient(connectUri)

export let db
export let collection

async function initMongo() {
  console.log(1)
  await mongo.connect()
  db = mongo.db('sample_airbnb')
  collection = db.collection('listingsAndReviews')
}
initMongo()
  .then(() => console.log('mongodb connected'))
  .catch(err => console.log(err))
