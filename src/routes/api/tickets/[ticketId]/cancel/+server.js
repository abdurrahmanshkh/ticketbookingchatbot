import { json } from '@sveltejs/kit';

export async function POST({ params }) {
	const ticketId = params.ticketId;
	const apiKey = 'qF3wveUq2Z2WAvnd5Q83NHdZ5NFEt6H9iQw0jmWFHNnILl0jIozEiKu0Znpkliay';
	const endpoint =
		'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gvblzlp/endpoint/data/v1/action/updateOne';

	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': apiKey
			},
			body: JSON.stringify({
				dataSource: 'Cluster0',
				database: 'test',
				collection: 'tickets',
				filter: { _id: { $oid: ticketId } },
				update: { $set: { cancelled: true } }
			})
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const result = await response.json();
		return json({ success: true, result });
	} catch (error) {
		console.error('Error updating payment status:', error);
		return json({ success: false, error: error.message });
	}
}
