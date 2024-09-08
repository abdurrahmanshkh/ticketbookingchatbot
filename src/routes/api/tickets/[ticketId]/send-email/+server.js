import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

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

// Function to create a PDF for the ticket
async function createPDF(person, numberOfTickets, date) {
	const pdfDoc = await PDFDocument.create();
	const page = pdfDoc.addPage([400, 600]);
	const { width, height } = page.getSize();
	const fontSize = 14;

	const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
	const logoBytes = fs.readFileSync(path.join('static', 'logo.png'));
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
		size: fontSize,
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
		y: height - 320,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`Date of Visit: ${date}`, {
		x: 30,
		y: height - 360,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`Museum Address: CSMVS, Fort, Mumbai`, {
		x: 30,
		y: height - 400,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	page.drawText(`Contact: +91 22 6958 4400`, {
		x: 30,
		y: height - 440,
		size: fontSize,
		font: font,
		color: rgb(0, 0, 0)
	});

	return await pdfDoc.save();
}

export async function POST({ request }) {
	const { person, email, numberOfTickets, date } = await request.json();

	try {
		const pdfBuffer = await createPDF(person, numberOfTickets, date);

		// Define email options
		const mailOptions = {
			from: 'csmvschatbot@outlook.com',
			to: email,
			subject: 'Your Ticket Confirmation for CSMVS Museum, Mumbai',
			text: `Dear ${person},\n\nThank you for booking your tickets to visit the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS) Museum in Mumbai.\n\nHere are your ticket details:\n\nVisitor Name: ${person}\nNumber of Tickets: ${numberOfTickets}\nDate of Visit: ${date}\n\nPlease find your e-ticket attached as a PDF.\n\nWe look forward to welcoming you at the museum.\n\nMuseum Address: CSMVS, Fort, Mumbai\nContact: +91 22 6958 4400\n\nBest regards,\nCSMVS Museum Team`,
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
