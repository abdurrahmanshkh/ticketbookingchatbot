<script>
	import { Button, Card, Footer, Navbar, Carousel, P, Thumbnails } from 'flowbite-svelte';
	let message = '';
	let chatMessages = [];
	import images from './images.json';
	let index = 0;
	let forward = true;

	function sendMessage() {
		if (message.trim() !== '') {
			chatMessages = [...chatMessages, { user: 'You', text: message }];
			message = '';
			// Simulate bot response
			setTimeout(() => {
				chatMessages = [
					...chatMessages,
					{ user: 'Bot', text: "Thank you for your message. I'm here to assist you!" }
				];
			}, 1000);
		}
	}
</script>

<main class="max-w-full bg-slate-200 py-10 md:px-16">
	<Card class="max-w-full space-y-4">
		<h2 class="self-start text-2xl font-bold">Gallery</h2>
		<Carousel {images} {forward} let:Indicators let:Controls class="min-h-96">
			<Controls />
			<Indicators />
		</Carousel>
	</Card>

	<section id="about" class="max-w-full grid md:grid-cols-2 gap-8 mt-8">
		<Card class="max-w-full">
			<h2 class="mb-4 text-2xl font-bold">
				Welcome to the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS)
			</h2>
			<p class="mb-4 text-gray-700">
				The CSMVS, formerly known as the Prince of Wales Museum, is one of the premier art and
				history museums in India. Located in the heart of Mumbai, it showcases a diverse collection
				of artifacts, ranging from ancient sculptures to modern art, all housed within a beautiful
				heritage building.
			</p>
			<p class="text-gray-700">
				Our museum offers visitors a chance to explore India’s rich cultural heritage and history.
				With over 60,000 exhibits, we cover a broad spectrum of art and history, from the Indus
				Valley Civilization to the present day.
			</p>
		</Card>
		<Card class="max-w-full">
			<h2 class="mb-4 text-2xl font-bold">Chat with Our Ticket Booking Bot</h2>
			<div class="chatbox mb-4 h-64 overflow-y-auto rounded-lg bg-gray-100 p-4">
				{#each chatMessages as chat}
					<p class={chat.user === 'Bot' ? 'text-blue-600' : 'text-gray-800'}>
						<strong>{chat.user}:</strong>
						{chat.text}
					</p>
				{/each}
			</div>
			<div class="flex items-center">
				<input
					type="text"
					bind:value={message}
					placeholder="Type your message..."
					class="mr-2 w-full rounded-lg border p-2"
				/>
				<Button on:click={sendMessage}>Send</Button>
			</div>
		</Card>
	</section>

</main>
