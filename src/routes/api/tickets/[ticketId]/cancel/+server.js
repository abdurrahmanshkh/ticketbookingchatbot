import { json } from '@sveltejs/kit';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export async function POST({ params }) {
	const ticketId = params.ticketId;

	try {
		await client.connect();
		const db = client.db('test');
		const collection = db.collection('tickets');

		const result = await collection.updateOne(
			{ _id: new ObjectId(ticketId) },
			{ $set: { cancelled: true } }
		);

		return json({ success: true, result });
	} catch (error) {
		console.error('Error updating ticket status:', error);
		return json({ success: false, error: error.message });
	} finally {
		await client.close();
	}
}
