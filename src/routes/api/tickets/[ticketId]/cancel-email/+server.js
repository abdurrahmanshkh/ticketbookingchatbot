import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a mail transporter using nodemailer for Outlook
const transporter = nodemailer.createTransport({
	host: 'smtp-relay.brevo.com',
	port: 587,
	secure: false, // Use TLS
	auth: {
		user: '80b8b8001@smtp-brevo.com', // Your Brevo SMTP login
		pass: process.env.BREVO_PASS // Your Brevo SMTP key value
	},
	tls: {
		ciphers: 'SSLv3' // Add this to avoid some TLS-related errors
	}
});

export async function POST({ request }) {
	const { person, email, numberOfTickets, date, ticketId } = await request.json();

	try {
		// Define email options
		const mailOptions = {
			from: 'CSMVS Cancellation Team <transactionalerts@yahoo.com>', // Sender address
			to: email,
			subject: 'Your Ticket Cancellation for CSMVS Museum, Mumbai',
			html: `
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
      background-color: #d9534f;
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
    .content h2 {
      color: #d9534f;
      font-size: 20px;
      margin-bottom: 10px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #333333;
    }
    .content .ticket-details {
      margin: 20px 0;
      padding: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 5px;
      background-color: #f8f9fa;
    }
    .content .ticket-details p {
      margin: 5px 0;
    }
	  .disclaimer {
      padding: 15px;
      background-color: #fff4e5;
      border-left: 4px solid #ffa726;
      color: #666666;
      font-size: 14px;
      border-radius: 3px;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      padding: 10px 20px;
      background-color: #f4f4f4;
      color: #666666;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      margin: 20px 0;
      padding: 10px 20px;
      font-size: 16px;
      color: #ffffff;
      background-color: #d9534f;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CSMVS Ticket Cancellation</h1>
    </div>
    <div class="content">
      <h2>Dear ${person},</h2>
      <p>We regret to inform you that your booking to visit the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS) Museum in Mumbai has been cancelled as per your request.</p>
      
      <div class="ticket-details">
        <h3>Cancelled Ticket Details:</h3>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Visitor Name:</strong> ${person}</p>
        <p><strong>Number of Tickets:</strong> ${numberOfTickets}</p>
        <p><strong>Date of Visit:</strong> ${date}</p>
      </div>

      <p>If you have any questions or need further assistance, please contact us at <strong>+91 22 6958 4400</strong> or reply to this email.</p>
      <p>We hope to welcome you to the museum in the future.</p>
    </div>

    <div class="disclaimer">
      <strong>Disclaimer:</strong> This email is sent from an unofficial demo chatbot for CSMVS and is not part of the museum’s official booking system. The payment link is simulated and will <em>not</em> process real transactions.
    </div>

    <div class="footer">
      <p>&copy; 2024 CSMVS Museum. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`
		};

		await transporter.sendMail(mailOptions);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error sending email:', error);
		return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
	}
}
