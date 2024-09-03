<script>
	import '../app.css';
	import { Navbar, NavBrand, NavHamburger, Button, Input, Footer, FooterCopyright } from 'flowbite-svelte';
  	import { SearchOutline } from 'flowbite-svelte-icons';
</script>

<header>
	<Navbar class="bg-yellow-950 p-4">
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-bold mr-2 text-orange-100">
				Chhatrapati Shivaji Maharaj Vastu Sangrahalaya
			</span>
			<span class="self-center whitespace-nowrap text-xl font-semibold text-orange-100">
				(CSMVS)
			</span>
		</NavBrand>
		<NavBrand>
			<span class="self-center whitespace-nowrap text-xl font-semibold text-red-100">
				Ticket Booking Chatbot
			</span>
		</NavBrand>
	</Navbar>
</header>

<main style="min-height: 81.5vh;">
	<slot/>
</main>

<footer>
	<Navbar class="bg-yellow-950 p-4 text-orange-100">
		<Footer rounded color="form" class="w-full flex items-center text-center justify-center">
			© Created as a sample chatbot website. All Rights Reserved.
		</Footer>
	</Navbar>
</footer>
