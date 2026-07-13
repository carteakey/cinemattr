<script>
	import '../app.css';
	import Navbar from '../lib/components/NavBar.svelte';
	import Footer from '../lib/components/Footer.svelte';
	import { inject } from '@vercel/analytics';
	import { dev } from '$app/environment';

	inject({ mode: dev ? 'development' : 'production' });

	let { children } = $props();
</script>

<div class="page-shell">
	<div class="mx-auto flex min-h-screen max-w-5xl flex-col px-5 text-white sm:px-8">
		<Navbar />
		<main class="flex-1">{@render children()}</main>
		<Footer />
	</div>
</div>
