<script>
	import { Button, ButtonGroup, Card, Carousel, Input, Label } from 'flowbite-svelte';
	let message = '';
	let chatMessages = [];
	import images from './images.json';
	let forward = true;

	async function sendMessage() {
		if (message.trim() !== '') {
			// Add user message to the chat
			chatMessages = [...chatMessages, { user: 'You', text: message }];

			// Send message to the backend API for Dialogflow processing
			try {
				const response = await fetch('/api/detect-intent', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ message })
				});

				const data = await response.json();

				// Append the bot's response to the chat
				chatMessages = [
					...chatMessages,
					{ user: 'Bot', text: data.reply || "Sorry, I didn't understand that." }
				];
			} catch (error) {
				console.error('Error communicating with chatbot API:', error);
				chatMessages = [
					...chatMessages,
					{ user: 'Bot', text: 'Something went wrong. Please try again later.' }
				];
			}

			// Clear the input field
			message = '';
		}
	}
</script>

<main
	class="max-w-full bg-[url('https://lh3.googleusercontent.com/pw/AP1GczP-GJM0ameJZS6Xg--gOPWpbmDCLPuQjjuxYrzhUeB-SVE1kQMgmLoMtwvFDe1E5MD9_CNNvkMzsmdctjSqokvKqbvZsdLLoRVeeCgB4nLLqBGsNlTRcKBIOcNXeZych6xg8rnq6Ex19ggzDTq_NbDU=w1283-h855-s-no-gm?authuser=0')]
    bg-cover bg-center bg-no-repeat py-10 md:px-16"
>
	<!-- Gallery -->
	<Card class="max-w-full space-y-4 bg-opacity-60 text-inherit">
		<h2 class="self-start text-2xl font-bold">Gallery</h2>
		<Carousel {images} {forward} let:Indicators let:Controls class="min-h-96" duration="2000">
			<Controls />
			<Indicators />
		</Carousel>
	</Card>

	<section id="about" class="mt-8 grid max-w-full gap-8 md:grid-cols-2">
		<!-- About -->
		<Card class="max-w-full bg-orange-100 bg-opacity-60 mix-blend-luminosity">
			<h2 class="mb-4 text-2xl font-bold">
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

		<!-- Chatbot -->
		<Card class="max-w-full bg-red-100 bg-opacity-60 text-inherit">
			<h2 class="mb-4 text-2xl font-bold">Chat with Our Ticket Booking Bot</h2>
			<div class="chatbox mb-4 h-full overflow-y-auto rounded-lg bg-orange-50 bg-opacity-50 p-4">
				{#each chatMessages as chat}
					<p class={chat.user === 'Bot' ? 'text-blue-800' : 'text-gray-800'}>
						<strong>{chat.user}:</strong>
						{chat.text}
					</p>
				{/each}
			</div>
			<ButtonGroup class="w-full">
				<Input
					type="text"
					bind:value={message}
					placeholder="Type your message..."
					on:keydown={(e) => e.key === 'Enter' && sendMessage()}
				/>
				<Button on:click={sendMessage} color="red">Send</Button>
			</ButtonGroup>
		</Card>
	</section>
</main>
