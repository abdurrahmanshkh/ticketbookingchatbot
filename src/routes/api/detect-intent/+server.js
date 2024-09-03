import { json } from '@sveltejs/kit';
import dialogflow from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

// Create a session client
const sessionClient = new dialogflow.SessionsClient({
	credentials: {
		type: 'service_account',
		project_id: 'ace-axon-432609-c3',
		private_key_id: process.env.private_key_id,
		private_key:
			'-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDgmzHejiPg2yb0\n2+dYrMZVu8P0IhMakVza47gaUI04nUq0Zf+4uQnx3RtR+7FkZG5K5rNgaHRCR+Zx\nB/j4Sf/IiJql5M7pOogXC5gHQHwrgd/HaDeGwYxCOasPIbybthsx9pKuLlR6WOl8\nGe2Dd6vod/Y74gRJCtbDCYZVTqdDAkE8O3ZVHAHJ3PJIBsTwZOi4XYCuUEg/OvQo\nuOzRRPy0xFaj4IOZHQV5RVvdy3q4uzLvQV2MlFPWLHs1WugXAuTJpTtlkGDPO3er\nlAKUILLP2xcJo01/UW57ZUik3z2OjqIpbUBSa7IpobNRlKFwui4YXypY+/ITSKlJ\n8FI7hmJ1AgMBAAECggEAGZpHPH3KZDLHBYldnTOQpiwxoY4SzGf+hCsKDOHavzXa\n0qZ/2GArXIkeOKGurmluUxZqIxa1DeshPwgwHqlcwVClBD0JQve7lJjrOwRkQxda\nWWItViyQ3umw8JghZkSDZBYd0UIRuiKRduaDtwU4sNaf2GKip2rXYUMgL3A4S8Bq\n302+a1DyVaJPHdoeVv3I/cbVQkwaAGOnewumzNAqOfrrxx6z0OxSB0lBBSJ/rEYL\nCPYFLSU+V3gFxWHJ7KV2axaM6pi4yBucA8Fp13dEOu73P8NZhCbQlO92JgwFMJtr\nIvdSx16/l+L+cCAQqNsb2IPNIptdOp5c9zJVZqAdzwKBgQDz57fZWQ5hH/3zoogI\n2VYbxzAOG2ESYbqdKE5+netboeqwahlPvCNkwJWv3Q67m0mZfmVeP1iN5SN4iIuG\nlFg6tBnnWEuE7TIgTM0zvBUKdM4jwVMM9wXGXUukW3u+HeSpelelQLSDt8ZreIOJ\n4t/Lx9l3VjbSg3wQm16BZr6tAwKBgQDrvnv7HfdUvWHA1qCi7voaa5J4AEEnAqSD\nqcxs6q+OHk7NnZFNECZd049UVOqR0gMgIa5UjhsU9OC8uE4Tp8zPc6mnzE8b+F2r\nwpW/9WR5UNle3AF1yPcb+DK5HxQxecrt0yuLy87CV2Gm51J7ownoMiN27MC1VMTq\n3zhWnYWtJwKBgQCq71iPwLQtKWinGN9RpE+OxDhPiqyrX0aT4a2xWyeZXo7F+HWo\nxefgMoA1ci1jGd+o7UZJmQeM2mvTi46NUOXMrnABDIZQsJOSw4CEo2nznAzkThbQ\nXUb00Gm01FCS2wxoIk/Ohtx7+43Zv+of9pp1jKhB1HAzdOa8FMdU1RcI1QKBgHKK\n/CyYc8s9tViAME7adLUPnXwnC4EL3KmIgCZPpXsVKM7pB2d9OFcQayzbkZnGg/RB\nyTWWUnxNO0EXAAC24GHP3hgEwk9hzwmcoyxA7E+xw9w+Y4s6WS7C2spt2l7rwXjq\nyNbE8TImSPFSphYisraaXfbzs/KnPIKucO5M3V2zAoGBALyb0JLIIL7qvJ2HJDZc\nqtabbPNaCMpD5+UJDs/yxCUNgqXkLXEOHpDss2BrPvO4rqY4YABWHpbifsnEemCW\n/1cURmmK/DXGcJ7XPb10pqJR0Tza3QqfLdJQOs9mYgkvQTQIrrY9SKQjMNsGFZSX\njKNJh3n23VltWG5qIi9xfmkf\n-----END PRIVATE KEY-----\n',
		client_email: 'chatbot@ace-axon-432609-c3.iam.gserviceaccount.com',
		client_id: '107597892247490985375',
		auth_uri: 'https://accounts.google.com/o/oauth2/auth',
		token_uri: 'https://oauth2.googleapis.com/token',
		auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
		client_x509_cert_url:
			'https://www.googleapis.com/robot/v1/metadata/x509/chatbot%40ace-axon-432609-c3.iam.gserviceaccount.com',
		universe_domain: 'googleapis.com'
	}
});

// Your Dialogflow Project ID
const projectId = 'ace-axon-432609-c3';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { message } = await request.json();
	const sessionId = uuidv4(); // Generate a unique session ID for each request

	// Create a session path
	const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

	// Set up the request to Dialogflow
	const dialogflowRequest = {
		session: sessionPath,
		queryInput: {
			text: {
				text: message,
				languageCode: 'en'
			}
		}
	};

	// Send the request and get the response from Dialogflow
	try {
		const responses = await sessionClient.detectIntent(dialogflowRequest);
		const result = responses[0].queryResult;
		const reply = result.fulfillmentText || "I'm not sure how to answer that.";

		return json({ reply });
	} catch (error) {
		console.error('Dialogflow error:', error);
		return json({ reply: 'There was an error processing your request.' }, { status: 500 });
	}
}
