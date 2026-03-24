<script>
	import { Carousel } from 'flowbite-svelte';
	import { fly, fade } from 'svelte/transition';
	import { tick } from 'svelte';
	import images from './images.json';

	let message = '';
	let chatMessages = [];
	let isLoading = false;
	let forward = true;
	let buttonText = 'Expand';
	let expand = false;

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
		expand = !expand;
		buttonText = expand ? 'Collapse' : 'Expand';

	}
</script>

<!-- ── Disclaimer ── -->
<div
	in:fly={{ y: -20, duration: 500 }}
	class="mb-6 flex items-start gap-3 rounded-2xl border border-amber-600/30 bg-amber-950/40 p-4 shadow-lg backdrop-blur-sm"
>
	<span class="mt-0.5 shrink-0 text-xl">⚠️</span>
	<div>
		<p class="font-bold text-amber-400">Disclaimer</p>
		<p class="mt-0.5 text-sm leading-relaxed text-amber-200/75">
			This chatbot is an unofficial demo project and not the
			<strong class="font-semibold text-amber-300">official</strong>
			ticket booking portal for the Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS). Payments
			are simulated and will not process real transactions.
		</p>
	</div>
</div>

<!-- ── Gallery ── -->
<section
	in:fly={{ y: 24, duration: 600, delay: 100 }}
	class="mb-6 overflow-hidden rounded-3xl border border-amber-800/25 bg-stone-900/60 shadow-2xl shadow-black/50 backdrop-blur-sm"
>
	<div class="flex items-center gap-3 border-b border-amber-800/20 px-5 py-4">
		<span class="text-2xl">🏛️</span>
		<h2 class="text-lg font-bold tracking-wide text-amber-200 sm:text-xl">Gallery</h2>
		<div class="ml-auto h-px flex-1 bg-gradient-to-r from-amber-700/30 to-transparent"></div>
	</div>
	<div class="p-2 sm:p-3">
		<Carousel
			{images}
			{forward}
			let:Indicators
			let:Controls
			class="min-h-56 overflow-hidden rounded-2xl sm:min-h-80 md:min-h-96"
			duration="2000"
		>
			<Controls />
			<Indicators />
		</Carousel>
	</div>
</section>

<!-- ── About + Chatbot ── -->
<section
	in:fly={{ y: 24, duration: 600, delay: 200 }}
	class="grid gap-6 {expand ? 'grid-cols-1' : 'md:grid-cols-2'}"
>
	{#if !expand}
		<!-- About card -->
		<div
			in:fly={{ x: -20, duration: 400 }}
			class="rounded-3xl border border-amber-800/25 bg-stone-900/60 p-6 shadow-2xl shadow-black/50 backdrop-blur-sm"
		>
			<div class="mb-5 flex items-center gap-3">
				<div class="h-1 w-8 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400"></div>
				<h2 class="text-lg font-bold text-amber-200 sm:text-xl md:text-2xl">Welcome to CSMVS</h2>
			</div>
			<p class="mb-4 text-sm leading-relaxed text-stone-300 sm:text-base">
				The CSMVS, formerly known as the Prince of Wales Museum, is one of the premier art and
				history museums in India. Located in the heart of Mumbai, it showcases a diverse collection
				of artifacts, ranging from ancient sculptures to modern art, all housed within a beautiful
				heritage building.
			</p>
			<p class="mb-4 text-sm leading-relaxed text-stone-300 sm:text-base">
				Our museum offers visitors a chance to explore India’s rich cultural heritage and history.
				With over 60,000 exhibits, we cover a broad spectrum of art and history, from the Indus
				Valley Civilization to the present day.
			</p>
			<p class="text-sm leading-relaxed text-stone-300 sm:text-base">
				Beyond its impressive collection, CSMVS actively engages visitors with educational programs,
				workshops, and cultural events. The museum's dynamic offerings make art and history
				accessible and engaging, enhancing the visitor experience.
			</p>
			<!-- Stats row -->
			<div class="mt-6 grid grid-cols-3 gap-3">
				{#each [['60,000+', 'Exhibits'], ['1922', 'Established'], ['Mumbai', 'Location']] as [val, label]}
					<div class="rounded-2xl border border-amber-800/20 bg-amber-950/30 p-3 text-center">
						<p class="text-base font-black text-amber-400 sm:text-lg">{val}</p>
						<p class="text-xs text-stone-400">{label}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- ── Chatbot ── -->
	<div
		class="flex flex-col overflow-hidden rounded-3xl border border-stone-700/40 bg-stone-900/60 shadow-2xl shadow-black/50 backdrop-blur-sm {expand
			? 'h-[80vh]'
			: 'h-full'}"
	>
		<!-- Chatbot header bar -->
		<div class="flex items-center justify-between border-b border-stone-700/40 px-5 py-4">
			<div class="flex items-center gap-3">
				<div class="relative">
					<div
						class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-lg shadow-lg"
					>
						🤖
					</div>
					<span
						class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-stone-900 bg-green-400 shadow-sm shadow-green-400/50"
					></span>
				</div>
				<div>
					<h2 class="font-bold text-stone-100">AI Assistant</h2>
					<p class="text-xs text-green-400">Online · CSMVS</p>
				</div>
			</div>
			<button
				on:click={expandChatbot}
				class="rounded-full border border-stone-600/40 bg-stone-800/60 px-4 py-1.5 text-xs font-medium text-stone-300 transition-all duration-200 hover:border-amber-600/50 hover:bg-stone-700/60 hover:text-amber-300 sm:text-sm"
			>
				{buttonText}
			</button>
		</div>

		<!-- Messages area — grows to fill all space between header and input bar -->
		<div
			class="chat-scroll min-h-80 flex-1 overflow-y-auto p-4"
			bind:this={chatContainer}
		>
			{#if chatMessages.length === 0}
				<div
					class="flex h-full flex-col items-center justify-center text-center"
					in:fade={{ duration: 300 }}
				>
					<div class="mb-3 text-5xl opacity-20">💬</div>
					<p class="text-sm text-stone-500">Start a conversation!</p>
					<p class="mt-1 text-xs text-stone-600">Ask about tickets, timings, or exhibits.</p>
				</div>
			{/if}
			{#each chatMessages as chat, i (i)}
				<div
					in:fly={{ y: 12, duration: 250 }}
					class="mb-3 flex {chat.user === 'Bot' ? 'justify-start' : 'justify-end'}"
				>
					{#if chat.loading}
						<div
							class="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-stone-700/70 px-4 py-3"
						>
							<span class="typing-dot"></span>
							<span class="typing-dot"></span>
							<span class="typing-dot"></span>
						</div>
					{:else}
						<div
							class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
							{chat.user === 'Bot'
								? 'rounded-tl-sm bg-stone-700/70 text-stone-100'
								: 'rounded-tr-sm bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/30'}"
						>
							{chat.text}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Input area -->
		<div class="border-t border-stone-700/40 p-4">
			<div class="flex items-center gap-2">
				<input
					type="text"
					bind:value={message}
					placeholder="Type your message..."
					on:keydown={(e) => e.key === 'Enter' && sendMessage()}
					disabled={isLoading}
					class="min-w-0 flex-1 rounded-xl border border-stone-600/40 bg-stone-800/60 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition-all duration-200 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/20 disabled:opacity-50"
				/>
				<button
					on:click={sendMessage}
					disabled={isLoading}
					class="shrink-0 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-900/30 transition-all duration-200 hover:from-amber-500 hover:to-amber-400 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isLoading ? '···' : 'Send'}
				</button>
			</div>
		</div>
	</div>
</section>

<style>
	/* Typing indicator bounce */
	@keyframes typingBounce {
		0%,
		60%,
		100% {
			transform: translateY(0);
			opacity: 0.35;
		}
		30% {
			transform: translateY(-5px);
			opacity: 1;
		}
	}

	:global(.typing-dot) {
		display: inline-block;
		width: 7px;
		height: 7px;
		background-color: #a8a29e;
		border-radius: 50%;
		animation: typingBounce 1.2s ease-in-out infinite;
	}

	:global(.typing-dot:nth-child(2)) {
		animation-delay: 0.2s;
	}

	:global(.typing-dot:nth-child(3)) {
		animation-delay: 0.4s;
	}

	/* Slim scrollbar for chat window */
	:global(.chat-scroll::-webkit-scrollbar) {
		width: 3px;
	}

	:global(.chat-scroll::-webkit-scrollbar-track) {
		background: transparent;
	}

	:global(.chat-scroll::-webkit-scrollbar-thumb) {
		background-color: #44403c;
		border-radius: 2px;
	}
</style>
