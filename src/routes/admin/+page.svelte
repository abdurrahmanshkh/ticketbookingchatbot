<script>
	import { Input, Label, Button, Card, P, A } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	let username = 'CSMVS Admin';
	let password = '';
	let key = '1234';
	var error = '';
	var login = true;

	function handleLogin(event) {
		event.preventDefault();
		if (password == key) {
			login = true;
			error = '';
		} else {
			error = 'Incorrect Password';
		}
	}

	export let data; // The fetched data is passed as props to the page component
	let searchTerm = ''; // Search term for filtering the tickets

	let { tickets } = data; // Destructure the tickets from the data prop

	$: filteredTickets = tickets.filter(
		(ticket) => ticket.person.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);

	// Helper function to format the date
	function formatDate(dateString) {
		const date = new Date(dateString);
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	}
</script>

{#if login}
	<main>
		<!-- Render the table -->
		<Card class="max-w-full border-2 bg-gray-100 bg-opacity-60">
			<div class="grid md:grid-cols-3">
				<P class="text-2xl font-bold md:col-span-2 md:mt-1">Tickets Booked</P>
				<Input placeholder="Search by Person" bind:value={searchTerm} class="mb-4" />
			</div>
			<Table shadow class="w-full table-auto text-left">
				<TableHead class="border-2">
					<TableHeadCell>Ticket ID</TableHeadCell>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Quantity</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>Date</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each filteredTickets as ticket}
						<TableBodyRow>
							<TableBodyCell>
								<A href={`/${ticket._id}`}>
									{ticket._id}
								</A>
							</TableBodyCell>
							<TableBodyCell>{ticket.person}</TableBodyCell>
							<TableBodyCell>{ticket.number}</TableBodyCell>
							<TableBodyCell>{ticket.email}</TableBodyCell>
							<TableBodyCell>{formatDate(ticket.date)}</TableBodyCell>
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		</Card>
	</main>
{:else}
	<div class="flex max-w-full justify-center">
		<Card class="max-w-full bg-orange-100 bg-opacity-60 md:w-[60%]">
			<h1 class="pb-4 text-center text-3xl font-semibold text-yellow-950 dark:text-white">
				Admin Panel
			</h1>
			<Card class="max-w-full bg-primary-100">
				<form class="flex flex-col space-y-6" action="/">
					<h3 class="text-xl font-medium text-gray-900 dark:text-white">
						Login to Access Admin Panel
					</h3>
					<Label class="space-y-2">
						<span>Name</span>
						<Input type="text" name="name" placeholder="John" bind:value={username} disabled />
					</Label>

					<Label class="space-y-2">
						<span>Your password</span>
						<Input
							type="password"
							name="password"
							placeholder="•••••"
							bind:value={password}
							required
						/>
					</Label>
					{#if error.length > 0}
						<p class="text-red-500">{error}</p>
					{/if}
					<Label>
						<Button on:click={handleLogin} class="w-48">Login</Button>
					</Label>
				</form>
			</Card>
		</Card>
	</div>
{/if}
