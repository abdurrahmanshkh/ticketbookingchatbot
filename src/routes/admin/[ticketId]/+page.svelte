<script>
	import { Card } from 'flowbite-svelte';

	export let data;

	let { ticket } = data; // Destructure the ticket data
	let color = ""; // Initialize color

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

		if (
			date.getDate() > currentDate.getDate() &&
			date.getMonth() >= currentDate.getMonth() &&
			date.getFullYear() >= currentDate.getFullYear()
		) {
			color = 'yellow'; // Set color for upcoming date
			return 'Valid on upcoming date'; // Status for a future ticket date
		} else if (
			date.getDate() === currentDate.getDate() &&
			date.getMonth() === currentDate.getMonth() &&
			date.getFullYear() === currentDate.getFullYear()
		) {
			color = 'green'; // Set color for today's ticket
			return 'Valid for today'; // Status for the ticket date being today
		} else {
			color = 'red'; // Set color for expired ticket
			return 'Validity expired'; // Status for a past ticket date
		}
	}
</script>

<main class="max-w-full max-h-full flex justify-center items-center my-auto">
	{#if ticket}
		<Card class="md:w-[60%] max-w-full border-2 bg-{color}-100 bg-opacity-50 text-gray-900">
			<h1 class="mb-4 text-2xl font-bold">Ticket Details</h1>
			<p class="text-xl mb-1"><strong>Name:</strong> {ticket.person}</p>
			<p class="text-xl mb-1"><strong>Quantity:</strong> {ticket.number}</p>
			<p class="text-xl mb-1"><strong>Email:</strong> {ticket.email}</p>
			<p class="text-xl mb-1"><strong>Date:</strong> {formatDate(ticket.date)}</p>
			<p class="mb-1 text-xl"><strong>Payment:</strong> {ticket.payment}</p>
			<p class="text-xl text-{color}-900"><strong>Status:</strong> {getTicketStatus(ticket.date)}</p>
		</Card>
	{:else}
		<p class="mt-10 text-center text-red-500">Ticket not found or an error occurred.</p>
	{/if}
</main>
