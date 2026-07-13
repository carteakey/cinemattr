<script>
	import GitHubButton from './GitHub.svelte';
</script>

<footer
	class="mx-auto mt-20 flex w-full max-w-5xl flex-col items-center gap-4 border-t border-white/[0.07] py-7 sm:flex-row sm:justify-between"
>
	<p class="text-white/50 text-sm text-center md:text-left">
		Built with <span class="font-medium text-white/70">OpenAI-compatible models</span> and
		<span class="font-medium text-white/70">SvelteKit</span>.
	</p>

	<GitHubButton />
</footer>
