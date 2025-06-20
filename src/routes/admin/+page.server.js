import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);

export const load = async () => {
	try {
		await client.connect();
		const db = client.db('test');
		const collection = db.collection('tickets');

		const rawTickets = await collection.find({ payment: 'Done', cancelled: false }).toArray();

		// Convert MongoDB ObjectId to string
		const tickets = rawTickets.map((ticket) => ({
			...ticket,
			_id: ticket._id.toString()
		}));

		return {
			tickets
		};
	} catch (error) {
		console.error('Error fetching data:', error);
		return {
			tickets: []
		};
	} finally {
		await client.close();
	}
};
