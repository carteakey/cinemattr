<script>
	import '../app.css';
	import Navbar from '../lib/components/NavBar.svelte';
	import Footer from '../lib/components/Footer.svelte';
	import { inject } from '@vercel/analytics';
	import { dev } from '$app/environment';
	inject({ mode: dev ? 'development' : 'production' });
</script>

<div class="bg-pattern bg-repeat-y bg-cover justify-between ">
	<div class="backdrop-blur-md">
		<div class="text-white md:max-w-4xl md:mx-auto px-5 min-h-screen flex flex-col ">
			<Navbar />
			<slot />
			<Footer />
		</div>
	</div>
</div>
