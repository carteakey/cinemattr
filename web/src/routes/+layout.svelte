<script>
	import '../app.css';
	import Navbar from '../lib/components/NavBar.svelte';
	// import { dev } from '$app/environment';
	// import { inject } from '@vercel/analytics';
	// inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="bg-black">
	<div class="text-white max-w-4xl mx-auto min-h-screen">
	<Navbar />
		<slot />
	</div>
</div>
