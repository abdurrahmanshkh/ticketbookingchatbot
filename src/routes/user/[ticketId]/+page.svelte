<script>
	import { Button, Card, Alert } from 'flowbite-svelte';

	export let data;

	let { ticket } = data; // Destructure the ticket data
	let color = ''; // Initialize color
	let alert = '';
	let alertColor = 'green';

	// Helper function to format the date
	function formatDate(dateString) {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	}

	// Helper function to determine the ticket status and set color
	function getTicketStatus(ticketDate) {
		const currentDate = new Date();
		const date = new Date(ticketDate);

		if (currentDate < date) {
			color = 'yellow'; // Set color for upcoming date
			return 'Valid on upcoming date'; // Status for a future ticket date
		} else if (currentDate.toDateString() === date.toDateString()) {
			color = 'green'; // Set color for today's ticket
			return 'Valid for today'; // Status for the ticket date being today
		} else {
			color = 'red'; // Set color for expired ticket
			return 'Validity expired'; // Status for a past ticket date
		}
	}

	// Function to update the payment status
	async function updatePaymentStatus() {
		try {
			const response = await fetch(`/api/tickets/${ticket._id}/update-payment`, {
				method: 'POST'
			});

			const result = await response.json();

			if (result.success) {
				// Update ticket payment status on the client side
				ticket.payment = 'Done';
				alert = 'Payment status updated successfully!';

				// Call the function to send the email with the ticket
				await sendEmail(ticket);
			} else {
				alert = 'Failed to update payment status.';
				alertColor = 'red';
			}
		} catch (error) {
			console.error('Error updating payment status:', error);
		}
	}

	//Function to cancel the ticket
	async function cancelTicket() {
		try {
			const response = await fetch(`/api/tickets/${ticket._id}/cancel`, {
				method: 'POST'
			});

			const result = await response.json();

			if (result.success) {
				// Update ticket payment status on the client side
				ticket.cancelled = true;
				alert = 'Ticket cancelled successfully!';
			} else {
				alert = 'Failed to cancel ticket.';
				alertColor = 'red';
			}
		} catch (error) {
			console.error('Error cancelling ticket:', error);
		}
	}

	// Function to send email after payment is completed
	async function sendEmail(ticket) {
		try {
			const response = await fetch(`/api/tickets/${ticket._id}/send-email`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					person: ticket.person,
					email: ticket.email,
					numberOfTickets: ticket.number,
					date: formatDate(ticket.date),
					ticketId: ticket._id ,
				})
			});

			const result = await response.json();

			if (result.success) {
				alert = 'Payment status updated and email sent successfully!';
			} else {
				alert = 'Payment updated, but failed to send email.';
				alertColor = 'red';
			}
		} catch (error) {
			console.error('Error sending email:', error);
		}
	}
</script>

<main class="max-w-full max-h-full flex justify-center items-center my-auto">
	{#if ticket}
		<Card class="max-w-full border-2 md:w-[60%] bg-{color}-100 bg-opacity-50 text-gray-900">
			{#if alert}
				<Alert color={alertColor} class="mb-5">
					{alert}
				</Alert>
			{/if}
			<h1 class="mb-4 text-2xl font-bold">Ticket Details</h1>
			<p class="mb-1 text-xl"><strong>Name:</strong> {ticket.person}</p>
			<p class="mb-1 text-xl"><strong>Quantity:</strong> {ticket.number}</p>
			<p class="mb-1 text-xl"><strong>Email:</strong> {ticket.email}</p>
			<p class="mb-1 text-xl"><strong>Date:</strong> {formatDate(ticket.date)}</p>
			<p class="mb-1 text-xl"><strong>Payment:</strong> {ticket.payment}</p>
			<p class="text-xl text-{color}-900">
				<strong>Status:</strong>
				{getTicketStatus(ticket.date)}
			</p>
			{#if ticket.payment === 'Pending' && !ticket.cancelled}
				<div class="text-center">
					<Button on:click={updatePaymentStatus} color="red" class="mt-5 min-w-48">Pay Now</Button>
				</div>
			{/if}
			{#if ticket.payment === 'Done' && !ticket.cancelled}
				<div class="text-center">
					<Button on:click={cancelTicket} color="red" class="mt-5 min-w-48">Cancel Ticket</Button>
				</div>
			{/if}
			{#if ticket.cancelled}
				<p class="mt-2 text-xl font-bold text-red-800">This ticket has been cancelled.</p>
			{/if}
		</Card>
	{:else}
		<p class="mt-10 text-center text-red-500">Ticket not found or an error occurred.</p>
	{/if}
</main>
