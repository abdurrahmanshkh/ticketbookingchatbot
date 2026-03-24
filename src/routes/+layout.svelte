<script>
	import '../app.css';
</script>

<!-- ── Sticky Header ── -->
<header
	class="sticky top-0 z-50 w-full border-b border-amber-900/30 bg-stone-950/80 backdrop-blur-md"
>
	<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
		<!-- Logo / Brand -->
		<a
			href="/"
			class="flex items-center gap-2 text-xl font-black tracking-tight text-amber-400 transition-opacity hover:opacity-80 sm:text-2xl"
		>
			<span class="text-2xl">🏛️</span>
			CSMVS
		</a>

		<!-- Centre title — hidden on very small screens -->
		<div class="hidden text-center text-sm font-medium text-stone-400 sm:block md:text-base">
			Chhatrapati Shivaji Maharaj Vastu Sangrahalaya
		</div>

		<!-- Right badge -->
		<a
			href="/"
			class="rounded-full border border-amber-700/40 bg-amber-950/60 px-3 py-1 text-xs font-semibold text-amber-300 transition-all duration-200 hover:border-amber-500/60 hover:bg-amber-900/60 sm:px-4 sm:text-sm"
		>
			Ticket Booking
		</a>
	</div>
</header>

<!-- ── Main Content ── -->
<main
	class="min-h-screen w-full bg-stone-950 bg-[url('https://lh3.googleusercontent.com/pw/AP1GczOEN7J3iSznMIa6px037PaMw5JZDYIvXSaPyHJZ45OiWu4pLIu42NU5eHw0oMwXkRVnQmJkM7G4KRMB1tXnAAu1Dxa7qLeFJwEZ0rrlyKCNbAMP--5MdX-YW0Q-atHJ8xmb8gd1wToIsfZhzTo-X8rP=w1341-h894-s-no-gm?authuser=0')] bg-cover bg-center bg-fixed"
>
	<!-- Dark overlay for readability -->
	<div class="min-h-screen w-full bg-stone-950/80 px-4 py-8 sm:px-6 lg:px-8">
		<div class="mx-auto max-w-7xl">
			<slot />
		</div>
	</div>
</main>

<!-- ── Footer ── -->
<footer class="border-t border-stone-800 bg-stone-950">
	<div
		class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-4 text-center sm:flex-row sm:text-left"
	>
		<span class="text-sm text-stone-500">
			© <span class="font-semibold text-amber-700">CSMVS</span> — Ticket Booking Demo
		</span>
		<span class="text-xs text-stone-600">
			Unofficial demo · Payments are simulated
		</span>
	</div>
</footer>
