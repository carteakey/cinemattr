<script>
	import GitHubButton from './GitHub.svelte';
</script>

<div
	class="max-w-4xl mx-auto w-full flex md:flex-row flex-col items-center md:justify-between py-8 mt-20 border-t border-white/20 sticky top-[100vh]"
>
	<div class="text-white/70 flex items-center flex-none">
		Built using <span class="ml-1 font-bold">LangChain</span>,<span class="mx-1 font-bold"
			>OpenAI</span
		>
		& <span class="ml-1 font-bold">SvelteKit</span>.
	</div>

	<div class="flex items-center mt-2 md:mt-0">
		<GitHubButton />
	</div>
</div>
