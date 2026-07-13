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
	<div class="cinema-atmosphere" aria-hidden="true">
		<div class="projector-beam"></div>
		<div class="film-reel film-reel-left"></div>
		<div class="film-reel film-reel-right"></div>
		<div class="film-strip"></div>
		<div class="dust-field"></div>
	</div>
	<div class="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col px-5 text-white sm:px-8">
		<Navbar />
		<main class="flex-1">{@render children()}</main>
		<Footer />
	</div>
</div>
