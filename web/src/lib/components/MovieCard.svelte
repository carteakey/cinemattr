<script>
	import { fade } from 'svelte/transition';

	/** @type {{ title_id: string }} */
	let { title_id } = $props();

	async function getMovieInfo() {
		try {
			const response = await fetch('/api/getDetails', {
				method: 'POST',
				body: JSON.stringify({ title_id }),
				headers: { 'content-type': 'application/json' }
			});
			const movieInfo = await response.json();

			if (!response.ok || movieInfo?.error) {
				return { error: movieInfo?.error?.message ?? 'Unable to load movie details right now.' };
			}

			return movieInfo;
		} catch {
			return { error: 'Unable to load movie details right now.' };
		}
	}

	let promise = getMovieInfo();
</script>

<div>
	{#await promise then data}
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
				class="group flex h-full flex-col gap-4 border-2 border-amber-100/15 bg-[#171116] p-4 shadow-[6px_6px_0_rgba(84,32,62,0.35)] transition duration-300 hover:-translate-y-1 hover:border-amber-200/30 hover:shadow-[8px_9px_0_rgba(84,32,62,0.45)] md:flex-row md:p-5"
			>
				<div
					class="h-[240px] w-full flex-none border border-amber-100/15 bg-neutral-800 bg-cover bg-center shadow-inner md:h-[250px] md:w-[166px]"
					style={`background-image: url(${data.Poster})`}
				></div>
				<div class="flex flex-1 flex-col justify-between">
					<div>
						<div class="flex items-baseline justify-between gap-3">
							<h3
								class="display-type text-lg font-bold leading-snug tracking-[-0.02em] text-[#eee2c9]"
							>
								{data.Title}
							</h3>
							<span class="font-medium text-white/50 text-sm tabular-nums">{data.Year}</span>
						</div>
						<div class="text-white/50 text-xs uppercase tracking-wide mt-1 mb-3">{data.Genre}</div>
						<p class="mb-3 line-clamp-4 text-sm leading-relaxed text-white/70">{data.Plot}</p>
						<p class="text-white/50 text-xs line-clamp-2">
							<span class="text-white/40">Starring:</span>
							{data.Actors}
						</p>
					</div>

					<div class="mt-4 flex items-center justify-between gap-3">
						{#if data.imdbRating}
							<span
								class="inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-2 py-0.5 text-xs font-medium tabular-nums text-amber-200"
							>
								★ {data.imdbRating}
							</span>
						{:else}
							<span></span>
						{/if}
						<a
							target="_blank"
							href="https://www.imdb.com/title/{title_id}"
							rel="noreferrer"
							class="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
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
