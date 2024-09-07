<script>
	import { Input, Label, Button, Card, P } from 'flowbite-svelte';
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
	var login = false;

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

	let { voters } = data; // Destructure the voters from the data prop
</script>

{#if login}
	<main>
		<!-- Render the table -->
		<Card class="mx-auto max-w-full border-2 bg-gray-100">
			<div class="grid md:grid-cols-3">
				<P class="text-xl font-bold md:col-span-2 md:mt-2">Tickets Booked</P>
			</div>
			<Table shadow class="w-full table-auto text-left">
				<TableHead>
					<TableHeadCell>Person</TableHeadCell>
					<TableHeadCell>EPIC No</TableHeadCell>
					<TableHeadCell>Email</TableHeadCell>
					<TableHeadCell>Date</TableHeadCell>
				</TableHead>
				<TableBody>
					{#each voters as voter}
						<TableBodyRow>
							<TableBodyCell>{voter.person}</TableBodyCell>
							<TableBodyCell>{voter.number}</TableBodyCell>
							<TableBodyCell>{voter.email}</TableBodyCell>
							<TableBodyCell>{voter.date}</TableBodyCell>
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
