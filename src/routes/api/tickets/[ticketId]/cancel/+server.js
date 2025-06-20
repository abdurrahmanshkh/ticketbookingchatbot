import { json } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/mongo.js';

export async function POST({ params }) {
	const ticketId = params.ticketId;

	try {
		const db = await getDb();
		const collection = db.collection('tickets');

		const result = await collection.updateOne(
			{ _id: new ObjectId(ticketId) },
			{ $set: { cancelled: true } }
		);

		return json({ success: true, result });
	} catch (error) {
		console.error('Error updating ticket status:', error);
		return json({ success: false, error: error.message });
	}
}
