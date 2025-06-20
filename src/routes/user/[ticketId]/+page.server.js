import { ObjectId } from 'mongodb';
import { getDb } from '$lib/server/mongo.js';

export const load = async ({ params }) => {
	const ticketId = params.ticketId;

	try {
		const db = await getDb();
		const collection = db.collection('tickets');

		const ticket = await collection.findOne({ _id: new ObjectId(ticketId) });

		return {
			ticket: ticket ? { ...ticket, _id: ticket._id.toString() } : null
		};
	} catch (error) {
		console.error('Error fetching ticket data:', error);
		return {
			ticket: null
		};
	}
};
