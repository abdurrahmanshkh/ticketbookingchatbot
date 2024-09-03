import { json } from '@sveltejs/kit';
import dialogflow from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';

// Create a session client
const sessionClient = new dialogflow.SessionsClient({
	keyFilename: 'src/routes/api/detect-intent/dialogflow.json' // Update the path to your service account key file
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
