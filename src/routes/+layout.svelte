<script>
	import '../app.css';
	import { Navbar, NavBrand, NavHamburger, Button, Input, Footer, FooterCopyright } from 'flowbite-svelte';
  	import { SearchOutline } from 'flowbite-svelte-icons';
</script>

<header class="border-2">
	<Navbar>
		<NavBrand href="/">
			<span class="self-center whitespace-nowrap text-xl font-bold mr-2 text-primary-800">
				Voter's Data -
			</span>
			<span class="self-center whitespace-nowrap text-xl font-semibold text-primary-800">
				Owe, Kharghar
			</span>
		</NavBrand>
		<div class="flex md:order-2">
			<Button color="none" data-collapse-toggle="mobile-menu-3" aria-controls="mobile-menu-3" aria-expanded="false" class="md:hidden text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5 me-1">
			<SearchOutline class="w-5 h-5" />
			</Button>
			<div class="hidden relative md:block">
			<div class="flex absolute inset-y-0 start-0 items-center ps-3 pointer-events-none">
				<SearchOutline class="w-4 h-4" />
			</div>
			<Input id="search-navbar" class="ps-10" placeholder="Search..." />
			</div>
			<NavHamburger />
		</div>
	</Navbar>
</header>

<main style="min-height: 81.5vh;">
	<slot/>
</main>

<footer class="border-2">
	<Navbar>
		<Footer rounded color="form" class="w-full flex items-center text-center justify-center">
			<FooterCopyright href="/" by="Voter's Data™" year={2024} />
		</Footer>
	</Navbar>
</footer>
