<script>
	import { Button, Card, Input } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const messages = writable([]);

	let userMessage = '';

	async function sendMessage() {
		if (!userMessage.trim()) return;

		// Add the user's message to the messages list
		messages.update((msgs) => [...msgs, { sender: 'User', text: userMessage }]);

		// Send the message to the server-side endpoint
		const response = await fetch('/api/detect-intent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: userMessage })
		});

		const data = await response.json();

		// Add the bot's response to the messages list
		messages.update((msgs) => [...msgs, { sender: 'Bot', text: data.reply }]);

		// Clear the input field
		userMessage = '';
	}
</script>

<Card class="chat-container">
	<h2 class="mb-4 text-center text-2xl font-bold">Chat with Bot</h2>
	<div class="mb-4 space-y-4">
		<!-- Chat Messages -->
		{#each $messages as message (message.text)}
			<div class="flex {message.sender === 'User' ? 'justify-end' : 'justify-start'}">
				<div class="chat-bubble {message.sender.toLowerCase()}">
					<span class="font-semibold">{message.sender}:</span>
					{message.text}
				</div>
			</div>
		{/each}
	</div>

	<!-- Input and Send Button -->
	<div class="flex items-center">
		<Input
			type="text"
			class="form-control mr-2 flex-grow rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
			bind:value={userMessage}
			placeholder="Type your message..."
			on:keydown={(e) => e.key === 'Enter' && sendMessage()}
		/>
		<Button class="btn btn-primary" on:click={sendMessage}>Send</Button>
	</div>
</Card>

<style>
	.chat-container {
		max-width: 600px;
		margin: 0 auto;
		padding: 20px;
		background-color: #fff;
		border-radius: 0.5rem;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}
	.chat-bubble {
		max-width: 75%;
		padding: 10px;
		border-radius: 1rem;
		margin-bottom: 10px;
	}
	.chat-bubble.user {
		background-color: #007bff;
		color: white;
		align-self: flex-end;
	}
	.chat-bubble.bot {
		background-color: #e2e8f0;
		color: black;
		align-self: flex-start;
	}
</style>
