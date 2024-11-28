import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = 'qF3wveUq2Z2WAvnd5Q83NHdZ5NFEt6H9iQw0jmWFHNnILl0jIozEiKu0Znpkliay';
const mongoEndpoint =
	'https://ap-southeast-1.aws.data.mongodb-api.com/app/data-gvblzlp/endpoint/data/v1/action/findOne';

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define schema and model for ticket bookings
const ticketSchema = new mongoose.Schema(
	{
		person: String,
		number: Number,
		email: String,
		date: String,
		payment: String,
		cancelled: Boolean
	},
	{
		timestamps: true
	}
);

const Ticket = mongoose.model('Ticket', ticketSchema);

const app = express();
app.use(bodyParser.json());

// Function to format date in DD-MM-YYYY format
function formatDate(isoDateString) {
	const date = new Date(isoDateString);
	const day = String(date.getUTCDate()).padStart(2, '0');
	const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
	const year = date.getUTCFullYear();
	return `${day}-${month}-${year}`;
}

async function fetchDataFromMongoDB(filter = {}) {
	try {
		const response = await fetch(mongoEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': apiKey
			},
			body: JSON.stringify({
				dataSource: 'Cluster0',
				database: 'test',
				collection: 'tickets',
				filter: filter
			})
		});
		if (!response.ok) {
			throw new Error(`Error fetching data: ${response.statusText}`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching data from MongoDB:', error);
		throw error;
	}
}

// Function to send email using Brevo API
async function sendEmailWithBrevo(email, person, numberOfTickets, date, paymentUrl) {
	const mailPayload = {
		sender: {
			name: 'CSMVS Booking Team',
			email: 'transactionalerts@yahoo.com'
		},
		to: [
			{
				email: email,
				name: person
			}
		],
		subject: 'Payment Request for Your Booking',
		htmlContent: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 10px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #4CAF50; }
            .details { margin: 20px 0; }
            .details p { margin: 5px 0; }
            .btn { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Payment Confirmation</h1>
            </div>
            <p>Dear ${person},</p>
            <p>Thank you for booking your tickets. Please find your booking details below:</p>
            <div class="details">
              <p><strong>Visitor Name:</strong> ${person}</p>
              <p><strong>Number of Tickets:</strong> ${numberOfTickets}</p>
              <p><strong>Date of Visit:</strong> ${formatDate(date)}</p>
            </div>
            <p>To complete your payment, please click the button below:</p>
            <p><a href="${paymentUrl}" class="btn">Complete Payment</a></p>
            <p>If you have any questions, feel free to contact us.</p>
            <p>Best regards,<br>CSMVS Booking Team</p>
          </div>
        </body>
      </html>
    `
	};

	try {
		const response = await fetch('https://api.brevo.com/v3/smtp/email', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'api-key': process.env.BREVO_API_KEY
			},
			body: JSON.stringify(mailPayload)
		});

		if (!response.ok) {
			throw new Error(`Email sending failed: ${response.statusText}`);
		}
		console.log('Email sent successfully');
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
}

// Webhook route to handle Dialogflow's fulfillment request
app.post('/webhook', async (req, res) => {
	const queryResult = req.body.queryResult;

	const person = queryResult.parameters.person.name;
	const numberOfTickets = queryResult.parameters.number;
	const email = queryResult.parameters.email;
	const date = queryResult.parameters['date-time'] || 'not specified';

	const newBooking = new Ticket({
		person: person,
		number: numberOfTickets,
		email: email,
		date: date,
		payment: 'Pending',
		cancelled: false
	});

	try {
		await newBooking.save();

		const data = await fetchDataFromMongoDB({
			person: person,
			number: numberOfTickets,
			email: email,
			date: date,
			cancelled: false
		});

		const paymentUrl = `https://ticketbookingchatbot-production.up.railway.app/user/${data.document._id}`;

		await sendEmailWithBrevo(email, person, numberOfTickets, date, paymentUrl);

		res.json({
			fulfillmentText: `${person}, your booking has been made successfully. A payment confirmation email has been sent to ${email}. Kindly complete the payment to confirm your booking.`,
			fulfillmentMessages: [
				{
					text: {
						text: [
							`${person}, your booking has been made successfully. A payment confirmation email has been sent to ${email}. Kindly complete the payment to confirm your booking.`
						]
					}
				}
			]
		});
	} catch (error) {
		console.error('Error processing booking:', error);
		res.json({
			fulfillmentText: `Sorry ${person}, there was an error processing your booking. Please try again later.`,
			fulfillmentMessages: [
				{
					text: {
						text: [
							`Sorry ${person}, there was an error processing your booking. Please try again later.`
						]
					}
				}
			]
		});
	}
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
