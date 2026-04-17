<script>
	import { fade } from 'svelte/transition';
	/**
	 * @type string
	 */
	export let title_id;

	async function getMovieInfo() {
		try {
			const response = await fetch('/api/getDetails', {
				method: 'POST',
				body: JSON.stringify({ title_id: title_id }),
				headers: {
					'content-type': 'application/json'
				}
			});
			const movieInfo = await response.json();

			if (!response.ok || movieInfo?.error) {
				return {
					error: movieInfo?.error?.message ?? 'Unable to load movie details right now.'
				};
			}

			return movieInfo;
		} catch {
			return {
				error: 'Unable to load movie details right now.'
			};
		}
	}

	let promise = getMovieInfo();
</script>

<div>
	{#await promise}
		<!-- LoadingCard renders at parent level -->
	{:then data}
		{#if data.error}
			<div
				in:fade
				class="flex flex-col rounded-xl border border-white/10 bg-neutral-900/60 p-5 shadow-lg backdrop-blur-sm"
			>
				<div class="font-semibold text-white text-sm mb-1">{title_id}</div>
				<p class="text-white/60 text-sm italic">{data.error}</p>
			</div>
		{:else}
			<div
				in:fade
				class="group flex flex-col md:flex-row gap-4 rounded-xl border border-white/10 bg-neutral-900/60 p-4 md:p-5 shadow-lg backdrop-blur-sm transition hover:border-white/20 hover:bg-neutral-900/75"
			>
				<div
					class="h-[220px] md:h-[240px] w-full md:w-[160px] flex-none rounded-lg bg-neutral-800 bg-center bg-cover shadow-inner"
					style={`background-image: url(${data.Poster})`}
				/>
				<div class="flex flex-1 flex-col justify-between">
					<div>
						<div class="flex items-baseline justify-between gap-3">
							<h3 class="font-semibold text-white text-base leading-snug">
								{data.Title}
							</h3>
							<span class="font-medium text-white/50 text-sm tabular-nums">{data.Year}</span>
						</div>
						<div class="text-white/50 text-xs uppercase tracking-wide mt-1 mb-3">
							{data.Genre}
						</div>

						<p class="text-white/85 text-sm leading-relaxed mb-3 line-clamp-4">
							{data.Plot}
						</p>
						<p class="text-white/50 text-xs line-clamp-2">
							<span class="text-white/40">Starring:</span>
							{data.Actors}
						</p>
					</div>

					<div class="mt-4 flex items-center justify-between gap-3">
						{#if data.imdbRating}
							<span
								class="inline-flex items-center gap-1 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-2 py-0.5 text-xs font-medium text-yellow-200 tabular-nums"
							>
								★ {data.imdbRating}
							</span>
						{:else}
							<span />
						{/if}
						<a
							target="_blank"
							href="https://www.imdb.com/title/{title_id}"
							rel="noreferrer"
							class="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10"
							aria-label="Open on IMDb"
						>
							<img src="./IMDB.svg" alt="" class="h-4 w-auto" />
							<span>IMDb</span>
						</a>
					</div>
				</div>
			</div>
		{/if}
	{/await}
</div>
