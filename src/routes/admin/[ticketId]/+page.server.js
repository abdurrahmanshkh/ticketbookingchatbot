import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export const load = async ({ params }) => {
	const ticketId = params.ticketId;

	try {
		await client.connect();
		const db = client.db('test');
		const collection = db.collection('tickets');

		const ticket = await collection.findOne({ _id: new ObjectId(ticketId) });

		// Convert _id to string if ticket found
		const serializableTicket = ticket ? { ...ticket, _id: ticket._id.toString() } : null;

		return {
			ticket: serializableTicket
		};
	} catch (error) {
		console.error('Error fetching ticket data:', error);
		return {
			ticket: null
		};
	} finally {
		await client.close();
	}
};
