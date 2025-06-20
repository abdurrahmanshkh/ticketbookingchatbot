// src/lib/server/mongo.js
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';

let client;
let clientPromise;

if (!global._mongoClientPromise) {
	client = new MongoClient(uri);
	global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export async function getDb(dbName = 'test') {
	const client = await clientPromise;
	return client.db(dbName);
}
