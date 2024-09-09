import nodemailer from 'nodemailer';

// Create a mail transporter using nodemailer for Outlook
const transporter = nodemailer.createTransport({
	host: 'smtp.office365.com',
	port: 587,
	secure: false, // Use TLS
	auth: {
		user: 'csmvschatbot@outlook.com',
		pass: 'chatbot1234'
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
			from: 'csmvschatbot@outlook.com',
			to: email,
			subject: 'Your Ticket Cancellation for CSMVS Museum, Mumbai',
			text: `Dear ${person},\n\nWe regret to inform you that your booking for visiting the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS) Museum in Mumbai has been cancelled as per your request.\n\nHere are the details of the cancelled ticket:\n\nTicket ID: ${ticketId}\nVisitor Name: ${person}\nNumber of Tickets: ${numberOfTickets}\nDate of Visit: ${date}\n\nIf you have any questions or need further assistance, please contact us at +91 22 6958 4400 or reply to this email.\n\nWe hope to welcome you to the museum in the future.\n\nBest regards,\nCSMVS Museum Team`
		};

		await transporter.sendMail(mailOptions);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error sending email:', error);
		return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
	}
}
