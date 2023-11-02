import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const agg = [
  {
    $match: {
      product: new ObjectId("6542695016012f1fa0592bad")
    }
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: "$rating"
      },
      numOfReviews: {
        $sum: 1
      }
    }
  }
];

const client = await MongoClient.connect("", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const coll = client.db("e-commerce-api-learn").collection("reviews");
const cursor = coll.aggregate(agg);
const result = await cursor.toArray();
await client.close();
