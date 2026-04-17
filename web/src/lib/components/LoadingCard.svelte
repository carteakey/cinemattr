<script>
	import IconXL from './IconXL.svelte';
</script>

<div
	role="status"
	class="flex flex-col md:flex-row gap-4 rounded-xl border border-white/10 bg-neutral-900/50 p-4 md:p-5 shadow-lg backdrop-blur-sm animate-pulse"
>
	<div
		class="h-[220px] md:h-[240px] w-full md:w-[160px] flex-none rounded-lg bg-neutral-800/80 flex items-center justify-center text-white/10"
	>
		<IconXL />
	</div>

	<div class="flex-1 space-y-3">
		<div class="h-3 w-32 rounded-full bg-white/10" />
		<div class="h-2 w-48 rounded-full bg-white/10" />
		<div class="h-2 w-52 rounded-full bg-white/10" />
		<div class="h-2 w-48 rounded-full bg-white/10" />
		<div class="pt-3">
			<div class="h-2 w-40 rounded-full bg-white/10" />
		</div>
	</div>
	<span class="sr-only">Loading</span>
</div>
