import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';
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
			from: 'csmvschatbot@outlook.com',
			to: email,
			subject: 'Your Ticket Confirmation for CSMVS Museum, Mumbai',
			text: `Dear ${person},\n\nThank you for booking your tickets to visit the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS) Museum in Mumbai.\n\nHere are your ticket details:\n\nTicket ID: ${ticketId}\nVisitor Name: ${person}\nNumber of Tickets: ${numberOfTickets}\nDate of Visit: ${date}\n\nPlease find your e-ticket attached as a PDF.\n\nYou can also view your ticket status online using the following link:\n\nhttps://ticketbookingchatbot.vercel.app/user/${ticketId}\n\nWe look forward to welcoming you at the museum.\n\nMuseum Address: CSMVS, Fort, Mumbai\nContact: +91 22 6958 4400\n\nBest regards,\nCSMVS Museum Team`,
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
