import { APIGatewayEvent, Context } from "aws-lambda";
import { MongoClient } from "mongodb";

const uri = `mongodb://${process.env.MASTER_USERNAME}:${process.env.MASTER_PASSWORD}@${process.env.CLUSTER_ENDPOINT}/?ssl=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;

export const handler = async (event: APIGatewayEvent, context: Context) => {
  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db("mydatabase");
  const collection = database.collection("mycollection");

  const body = JSON.parse(event.body!);

  try {
    const result = await collection.insertOne(body);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Data inserted successfully", result }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to insert data", error }),
    };
  } finally {
    await client.close();
  }
};
