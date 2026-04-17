<script>
	import Icon from './Icon.svelte';
</script>

<nav class="sticky top-0 z-10 -mx-5 px-5 bg-neutral-950/40 border-b border-white/10 backdrop-blur-md mb-10">
	<div class="max-w-4xl mx-auto py-3">
		<div class="flex items-center justify-between">
			<a href="/" class="flex items-center gap-2 font-semibold tracking-tight text-white hover:text-white/90">
				<Icon />
				<span>cinemattr</span>
			</a>
			<div class="flex items-center gap-1">
				<a
					href="/faq"
					class="px-3 py-1.5 rounded-md text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition"
					>FAQ</a
				>
			</div>
		</div>
	</div>
</nav>
