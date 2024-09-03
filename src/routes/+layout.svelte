<script>
	import '../app.css';
	import { Navbar, NavBrand, NavHamburger, Button, Input, Footer, FooterCopyright } from 'flowbite-svelte';
  	import { SearchOutline } from 'flowbite-svelte-icons';
</script>

<header class="border-2 p-2">
	<Navbar>
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-bold mr-2 text-primary-900">
				Chhatrapati Shivaji Maharaj Vastu Sangrahalaya
			</span>
			<span class="self-center whitespace-nowrap text-xl font-semibold text-primary-900">
				(CSMVS)
			</span>
		</NavBrand>
		<NavBrand>
			<span class="self-center whitespace-nowrap text-xl font-semibold text-blue-900">
				Ticket Booking Chatbot
			</span>
		</NavBrand>
	</Navbar>
</header>

<main style="min-height: 81.5vh;">
	<slot/>
</main>

<footer class="border-2 p-2">
	<Navbar>
		<Footer rounded color="form" class="w-full flex items-center text-center justify-center">
			<FooterCopyright href="/" by="Chhatrapati Shivaji Maharaj Vastu Sangrahalaya." year={2024} />
		</Footer>
	</Navbar>
</footer>
