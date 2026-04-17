<script>
	import GitHubButton from './GitHub.svelte';
</script>

<footer
	class="max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center md:justify-between gap-4 py-8 mt-20 border-t border-white/10 sticky top-[100vh]"
>
	<p class="text-white/50 text-sm text-center md:text-left">
		Built with <span class="font-medium text-white/70">LangChain</span>,
		<span class="font-medium text-white/70">OpenAI-compatible models</span> and
		<span class="font-medium text-white/70">SvelteKit</span>.
	</p>

	<GitHubButton />
</footer>
