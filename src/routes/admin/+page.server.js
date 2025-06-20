import { getDb } from '$lib/server/mongo.js';

export const load = async () => {
	try {
		const db = await getDb();
		const collection = db.collection('tickets');

		const rawTickets = await collection.find({ payment: 'Done', cancelled: false }).toArray();

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
	}
};
