import { json } from '@sveltejs/kit';
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
			name: 'CSMVS Payments Team',
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
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 20px 0;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
    }
    .details {
      margin: 20px 0;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      background-color: #f8f9fa;
    }
    .details p {
      margin: 5px 0;
    }
    .button-container {
      text-align: center;
      margin: 20px 0;
    }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #c5cad4;
      text-decoration: none;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .btn:hover {
      background-color: #45a049;
    }
    .footer {
      text-align: center;
      padding: 10px 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Payment Confirmation</h1>
    </div>
    <div class="content">
      <p>Dear ${person},</p>
      <p>Thank you for booking your tickets. Please find your booking details below:</p>
      
      <div class="details">
        <p><strong>Visitor Name:</strong> ${person}</p>
        <p><strong>Number of Tickets:</strong> ${numberOfTickets}</p>
        <p><strong>Date of Visit:</strong> ${formatDate(date)}</p>
      </div>

      <p>To complete your payment, please click the button below:</p>
      <div class="button-container">
        <a href="${paymentUrl}" class="btn">Complete Payment</a>
      </div>

      <p>If you have any questions, feel free to contact us.</p>
      <p>Best regards,<br>CSMVS Booking Team</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 CSMVS Museum. All rights reserved.</p>
    </div>
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

export async function POST({ request }) {
	const { queryResult } = await request.json();

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

		const paymentUrl = `https://ticketbookingchatbot.vercel.app/user/${data.document._id}`;

		await sendEmailWithBrevo(email, person, numberOfTickets, date, paymentUrl);

		return json({
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
		return json({
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
}
