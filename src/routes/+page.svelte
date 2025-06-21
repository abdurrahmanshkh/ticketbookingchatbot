<script>
	import { Button, ButtonGroup, Card, Carousel, Input, Alert } from 'flowbite-svelte';
	import { tick } from 'svelte';
	import images from './images.json';

	let message = '';
	let chatMessages = [];
	let isLoading = false;
	let forward = true;
	let buttonText = 'Expand';
	let expand = false;
	let grid = 'mt-8 max-w-full gap-8 grid md:grid-cols-2';
	let height = 'h-[325px]';

	// Reference to chat container for scrolling
	let chatContainer;

	async function sendMessage() {
		if (message.trim() === '' || isLoading) return;

		// Add user message to the chat
		chatMessages = [...chatMessages, { user: 'You', text: message }];

		// Clear the input field immediately
		const userMessage = message;
		message = '';

		// Scroll to bottom after user message
		scrollToBottom();

		// Show typing indicator
		isLoading = true;
		chatMessages = [...chatMessages, { user: 'Bot', text: 'Typing...', loading: true }];
		scrollToBottom();

		try {
			const response = await fetch('/api/detect-intent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ message: userMessage })
			});

			const data = await response.json();
			const reply = data.reply || "Sorry, I didn't understand that.";

			// Remove typing indicator and append real reply
			chatMessages = chatMessages.filter((m) => !m.loading);
			chatMessages = [...chatMessages, { user: 'Bot', text: reply }];
		} catch (error) {
			console.error('Error communicating with chatbot API:', error);
			chatMessages = chatMessages.filter((m) => !m.loading);
			chatMessages = [
				...chatMessages,
				{ user: 'Bot', text: 'Something went wrong. Please try again later.' }
			];
		} finally {
			isLoading = false;
			// Wait for DOM update then scroll
			await tick();
			scrollToBottom();
		}
	}

	// Function to scroll to the bottom of the chat container
	function scrollToBottom() {
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
	}

	function expandChatbot() {
		if (!expand) {
			buttonText = 'Collapse';
			expand = true;
			grid = 'mt-8 max-w-full gap-8 grid md:grid-cols-1';
			height = 'h-[70vh]';
		} else {
			buttonText = 'Expand';
			expand = false;
			grid = 'mt-8 max-w-full gap-8 grid md:grid-cols-2';
			height = 'h-[325px]';
		}
	}
</script>

<!-- Disclaimer Banner -->
<Alert class="mb-4 border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700" role="alert">
	<p class="font-bold">Disclaimer</p>
	<p>
		This chatbot is an unofficial demo project and not the <strong>official</strong> ticket booking portal
		for the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS). Payments are simulated and will not
		process real transactions.
	</p>
</Alert>

<!-- Gallery -->
<Card class="max-w-full space-y-4 border-stone-300 bg-stone-100 bg-opacity-60 text-gray-900">
	<h2 class="self-start text-xl font-bold md:text-2xl">Gallery</h2>
	<Carousel {images} {forward} let:Indicators let:Controls class="min-h-96" duration="2000">
		<Controls />
		<Indicators />
	</Carousel>
</Card>

<section id="about" class={grid}>
	{#if !expand}
		<!-- About -->
		<Card class="max-w-full border-orange-200 bg-orange-100 bg-opacity-60 text-gray-900">
			<h2 class="mb-4 text-xl font-bold md:text-2xl">
				Welcome to the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS)
			</h2>
			<p class="mb-4 text-gray-700">
				The CSMVS, formerly known as the Prince of Wales Museum, is one of the premier art and
				history museums in India. Located in the heart of Mumbai, it showcases a diverse collection
				of artifacts, ranging from ancient sculptures to modern art, all housed within a beautiful
				heritage building.
			</p>
			<p class="mb-4 text-gray-700">
				Our museum offers visitors a chance to explore India’s rich cultural heritage and history.
				With over 60,000 exhibits, we cover a broad spectrum of art and history, from the Indus
				Valley Civilization to the present day.
			</p>
			<p class="text-gray-700">
				Beyond its impressive collection, CSMVS actively engages visitors with educational programs,
				workshops, and cultural events. The museum's dynamic offerings make art and history
				accessible and engaging, enhancing the visitor experience through interactive and
				informative experiences.
			</p>
		</Card>
	{/if}

	<!-- Chatbot -->
	<Card class="chat-container max-w-full border-gray-300 bg-gray-200 bg-opacity-60">
		<div class="mb-4 grid grid-cols-2 text-xl font-bold text-gray-900 md:text-2xl">
			<h2 class="mt-1">Chatbot</h2>
			<div class="max-w-full text-right">
				<Button class="w-32" color="dark" on:click={expandChatbot}>{buttonText}</Button>
			</div>
		</div>
		<Card padding="sm" class="max-w-full bg-gray-100">
			<div class="{height} overflow-auto" bind:this={chatContainer}>
				{#each chatMessages as chat}
					<div
						class={chat.user === 'Bot'
							? 'mb-2 flex justify-start text-left text-black'
							: 'mb-2 flex justify-end text-right text-white'}
					>
						<span
							class={chat.user === 'Bot'
								? 'max-w-[75%] rounded-xl bg-gray-300 p-3'
								: 'max-w-[75%] rounded-xl bg-blue-700 p-3'}
						>
							{chat.text}
						</span>
					</div>
				{/each}
			</div>

			<ButtonGroup>
				<Input
					type="text"
					bind:value={message}
					placeholder="Type your message..."
					on:keydown={(e) => e.key === 'Enter' && sendMessage()}
					disabled={isLoading}
				/>
				<Button on:click={sendMessage} color="dark" disabled={isLoading}>
					{isLoading ? '...' : 'Send'}
				</Button>
			</ButtonGroup>
		</Card>
	</Card>
</section>
