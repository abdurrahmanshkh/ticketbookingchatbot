<script>
	import { Button, ButtonGroup, Card, Carousel, Input, Label } from 'flowbite-svelte';
	import { tick } from 'svelte'; // Import tick to wait for DOM updates
	import images from './images.json';

	let message = '';
	let chatMessages = [];
	let forward = true;

	// Reference to chat container for scrolling
	let chatContainer;

	async function sendMessage() {
		if (message.trim() !== '') {
			// Add user message to the chat
			chatMessages = [...chatMessages, { user: 'You', text: message }];

			// Scroll to bottom after user message
			scrollToBottom();

			// Send message to the backend API for Dialogflow processing
			try {
				const response = await fetch('/api/detect-intent', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ message })
				});

				// Clear the input field
				message = '';

				const data = await response.json();

				// Append the bot's response to the chat
				chatMessages = [
					...chatMessages,
					{ user: 'Bot', text: data.reply || "Sorry, I didn't understand that." }
				];

				// Wait for the DOM to update and then scroll to the bottom
				await tick();
				scrollToBottom();
			} catch (error) {
				console.error('Error communicating with chatbot API:', error);
				chatMessages = [
					...chatMessages,
					{ user: 'Bot', text: 'Something went wrong. Please try again later.' }
				];

				// Wait for the DOM to update and then scroll to the bottom
				await tick();
				scrollToBottom();
			}
		}
	}

	// Function to scroll to the bottom of the chat container
	function scrollToBottom() {
		if (chatContainer) {
			chatContainer.scrollTop = chatContainer.scrollHeight;
		}
	}
</script>

<!-- Gallery -->
<Card class="max-w-full space-y-4 border-stone-300 bg-stone-100 bg-opacity-60 text-gray-900">
	<h2 class="self-start text-2xl font-bold">Gallery</h2>
	<Carousel {images} {forward} let:Indicators let:Controls class="min-h-96" duration="2000">
		<Controls />
		<Indicators />
	</Carousel>
</Card>

<section id="about" class="mt-8 grid max-w-full gap-8 md:grid-cols-2">
	<!-- About -->
	<Card class="max-w-full border-orange-200 bg-orange-100 bg-opacity-60 text-gray-900">
		<h2 class="mb-4 text-2xl font-bold">
			Welcome to the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS)
		</h2>
		<p class="mb-4 text-gray-700">
			The CSMVS, formerly known as the Prince of Wales Museum, is one of the premier art and history
			museums in India. Located in the heart of Mumbai, it showcases a diverse collection of
			artifacts, ranging from ancient sculptures to modern art, all housed within a beautiful
			heritage building.
		</p>
		<p class="mb-4 text-gray-700">
			Our museum offers visitors a chance to explore India’s rich cultural heritage and history.
			With over 60,000 exhibits, we cover a broad spectrum of art and history, from the Indus Valley
			Civilization to the present day.
		</p>
		<p class="text-gray-700">
			Beyond its impressive collection, CSMVS actively engages visitors with educational programs,
			workshops, and cultural events. The museum's dynamic offerings make art and history accessible
			and engaging, enhancing the visitor experience through interactive and informative
			experiences.
		</p>
	</Card>

	<!-- Chatbot -->
	<Card class="chat-container max-w-full border-gray-300 bg-gray-200 bg-opacity-60">
		<h2 class="mb-4 text-center text-2xl font-bold text-gray-900">
			Chat with Our Ticket Booking Bot
		</h2>
		<Card padding="sm" class="max-w-full bg-gray-100">
			<div class="max-h-[325px] min-h-[325px] overflow-auto" bind:this={chatContainer}>
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

			<ButtonGroup class="">
				<Input
					type="text"
					bind:value={message}
					placeholder="Type your message..."
					on:keydown={(e) => e.key === 'Enter' && sendMessage()}
				/>
				<Button on:click={sendMessage} color="dark">Send</Button>
			</ButtonGroup>
		</Card>
	</Card>
</section>
