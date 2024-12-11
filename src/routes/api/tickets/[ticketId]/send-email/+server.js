import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
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

// Function to create a QR code image
async function generateQRCode(url) {
	try {
		const qrCodeDataUrl = await QRCode.toDataURL(url);
		const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, '');
		return Buffer.from(base64Data, 'base64');
	} catch (error) {
		console.error('Error generating QR code:', error);
		throw error;
	}
}

// Function to create a PDF for the ticket
async function createPDF(person, numberOfTickets, date, ticketId) {
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([400, 600]);
	const { width, height } = page.getSize();
	const fontSize = 14;

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const logoBytes = fs.readFileSync('logo.png');
	const logoImage = await pdfDoc.embedPng(logoBytes);

	const logoDims = logoImage.scale(0.15);
	page.drawImage(logoImage, {
		x: width / 2 - logoDims.width / 2,
		y: height - 160,
		width: logoDims.width,
		height: logoDims.height
	});

	page.drawText('CSMVS Museum, Mumbai', {
		x: 30,
		y: height - 200,
		size: fontSize + 4,
		font: font,
		color: rgb(0, 0.4, 0.6)
	});

	page.drawText(`Ticket Confirmation`, {
		x: 30,
		y: height - 240,
		size: fontSize + 4,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`Visitor Name: ${person}`, {
		x: 30,
		y: height - 280,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`No. of Tickets: ${numberOfTickets}`, {
		x: 30,
		y: height - 310,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`Date of Visit: ${date}`, {
		x: 30,
		y: height - 340,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`Museum Address: CSMVS, Fort, Mumbai`, {
		x: 30,
		y: height - 370,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`Contact: +91 22 6958 4400`, {
		x: 30,
		y: height - 400,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`Verification QR:`, {
		x: 30,
		y: height - 500,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	// Generate the QR code and add it to the PDF
	const qrCodeUrl = `https://ticketbookingchatbot.vercel.app/user/${ticketId}`;
	const qrCodeImage = await generateQRCode(qrCodeUrl);
	const qrCodeImageEmbed = await pdfDoc.embedPng(qrCodeImage);
	const qrCodeDims = qrCodeImageEmbed.scale(0.7); // Increase the size of the QR code
	page.drawImage(qrCodeImageEmbed, {
		x: 140,
		y: 40, // Position the QR code at the bottom of the page
		width: qrCodeDims.width,
		height: qrCodeDims.height
	});

	return await pdfDoc.save();
}

export async function POST({ request }) {
	const { person, email, numberOfTickets, date, ticketId } = await request.json();

	try {
		const pdfBuffer = await createPDF(person, numberOfTickets, date, ticketId);

		// Define email options
		const mailOptions = {
			from: 'CSMVS Booking Team <transactionalerts@yahoo.com>', // Sender address
			to: email,
			subject: 'Your Ticket Confirmation for CSMVS Museum, Mumbai',
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
      background-color: #004d61;
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
      color: #004d61;
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
      background-color: #f4f4f4;
    }
    .content .ticket-details p {
      margin: 5px 0;
    }
    .footer {
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
      background-color: #c5cad4;
      text-decoration: none;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CSMVS Ticket Confirmation</h1>
    </div>
    <div class="content">
      <h2>Dear ${person},</h2>
      <p>Thank you for booking your tickets to visit the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS) Museum in Mumbai. We are thrilled to have you join us for a memorable experience.</p>
      
      <div class="ticket-details">
        <h3>Your Ticket Details:</h3>
        <p><strong>Ticket ID:</strong> ${ticketId}</p>
        <p><strong>Visitor Name:</strong> ${person}</p>
        <p><strong>Number of Tickets:</strong> ${numberOfTickets}</p>
        <p><strong>Date of Visit:</strong> ${date}</p>
      </div>

      <p>Your e-ticket is attached as a PDF. You can also view your ticket status online by clicking the button below:</p>
      <a href="https://ticketbookingchatbot.vercel.app/user/${ticketId}" class="button">View Ticket Status</a>

      <p>We look forward to welcoming you at the museum.</p>
      <p><strong>Museum Address:</strong> CSMVS, Fort, Mumbai</p>
      <p><strong>Contact:</strong> +91 22 6958 4400</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 CSMVS Museum. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`,
			attachments: [
				{
					filename: 'CSMVS_Ticket.pdf',
					content: pdfBuffer,
					contentType: 'application/pdf'
				}
			]
		};

		await transporter.sendMail(mailOptions);

		return new Response(JSON.stringify({ success: true }), { status: 200 });
	} catch (error) {
		console.error('Error sending email:', error);
		return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
	}
}
