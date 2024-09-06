<script>
	import '../app.css';
	import { Navbar, Footer, Card } from 'flowbite-svelte';
</script>

<header class="max-w-full overflow-auto">
	<Navbar class="bg-yellow-950 p-4">
		<div>
			<span class="self-center whitespace-nowrap md:text-xl font-bold text-orange-100">
				Chhatrapati Shivaji Maharaj Vastu Sangrahalaya
			</span>
			<span class="self-center whitespace-nowrap md:text-xl font-semibold text-orange-100">
				[CSMVS]
			</span>
		</div>
		<div>
			<span class="self-center whitespace-nowrap md:text-xl font-bold text-red-100">
				Ticket Booking Chatbot
			</span>
		</div>
	</Navbar>
</header>

<main class="bg-yellow-950">
<Card
	class="max-w-full bg-[url('https://lh3.googleusercontent.com/pw/AP1GczOEN7J3iSznMIa6px037PaMw5JZDYIvXSaPyHJZ45OiWu4pLIu42NU5eHw0oMwXkRVnQmJkM7G4KRMB1tXnAAu1Dxa7qLeFJwEZ0rrlyKCNbAMP--5MdX-YW0Q-atHJ8xmb8gd1wToIsfZhzTo-X8rP=w1341-h894-s-no-gm?authuser=0')]
    bg-cover bg-center bg-no-repeat py-10 md:px-16 border-yellow-800" padding="none"
>	<slot/>
</Card>
</main>

<footer class="max-w-full overflow-auto">
	<Navbar class="bg-yellow-950 p-4 text-orange-100">
		<Footer rounded color="form" class="min-w-full max-w-full overflow-auto text-center">
			© Created as a sample chatbot website. All Rights Reserved.
		</Footer>
	</Navbar>
</footer>
