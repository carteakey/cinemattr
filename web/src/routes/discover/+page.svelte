<script>
	import { onMount } from 'svelte';

	/** @typedef {{ imdbID: string, Title: string, Year: string, Genre: string, Plot: string, Poster: string, imdbRating?: string }} Movie */
	/** @type {Movie[]} */
	let movies = $state([]);
	/** @type {Movie[]} */
	let saved = $state([]);
	let index = $state(0);
	let loading = $state(true);
	let error = $state('');
	let mood = $state('surprising, highly rated movies with memorable plots');
	let dragX = $state(0);
	let dragging = $state(false);
	let startX = 0;
	let current = $derived(movies[index]);

	onMount(() => {
		try {
			saved = JSON.parse(localStorage.getItem('cinemattr-shortlist') ?? '[]');
		} catch {
			saved = [];
		}
		loadDeck();
	});

	async function loadDeck() {
		loading = true;
		error = '';
		index = 0;
		try {
			const search = await fetch('/api/getResults', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ query: mood })
			});
			/** @type {{ titles?: string[], error?: { message?: string } }} */
			const result = await search.json();
			if (!search.ok) throw new Error(result?.error?.message ?? 'Unable to build a movie deck.');

			const details = await Promise.all(
				(result.titles ?? []).slice(0, 12).map(async (title_id) => {
					const response = await fetch('/api/getDetails', {
						method: 'POST',
						headers: { 'content-type': 'application/json' },
						body: JSON.stringify({ title_id })
					});
					return response.ok ? response.json() : null;
				})
			);
			movies = details.filter((movie) => movie?.imdbID && movie?.Title);
			if (!movies.length) throw new Error('No movies matched. Try a broader mood.');
		} catch (caught) {
			error = caught instanceof Error ? caught.message : 'Unable to build a movie deck.';
			movies = [];
		} finally {
			loading = false;
		}
	}

	/** @param {boolean} liked */
	function choose(liked) {
		if (!current) return;
		if (liked && !saved.some((movie) => movie.imdbID === current.imdbID)) {
			saved = [...saved, current];
			localStorage.setItem('cinemattr-shortlist', JSON.stringify(saved));
		}
		dragX = 0;
		index += 1;
	}

	/** @param {KeyboardEvent} event */
	function handleKey(event) {
		if (event.key === 'ArrowLeft') choose(false);
		if (event.key === 'ArrowRight') choose(true);
	}

	/** @param {PointerEvent} event */
	function pointerDown(event) {
		startX = event.clientX;
		dragging = true;
		/** @type {HTMLElement} */ (event.currentTarget).setPointerCapture(event.pointerId);
	}

	/** @param {PointerEvent} event */
	function pointerMove(event) {
		if (dragging) dragX = event.clientX - startX;
	}

	function pointerUp() {
		dragging = false;
		if (Math.abs(dragX) > 90) choose(dragX > 0);
		else dragX = 0;
	}

	function clearSaved() {
		saved = [];
		localStorage.removeItem('cinemattr-shortlist');
	}
</script>

<svelte:window onkeydown={handleKey} />

<section class="mx-auto max-w-xl pb-16">
	<header class="mb-6 text-center">
		<p class="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-red-300">Movie match</p>
		<h1 class="text-4xl font-semibold tracking-tight">What should we watch?</h1>
		<p class="mt-2 text-sm text-white/60">Swipe, use ← and →, or tap the buttons.</p>
	</header>

	<form
		class="mb-6 flex gap-2"
		onsubmit={(event) => {
			event.preventDefault();
			loadDeck();
		}}
	>
		<label class="sr-only" for="mood">What are you in the mood for?</label>
		<input
			id="mood"
			bind:value={mood}
			class="min-w-0 flex-1 rounded-lg border border-white/15 bg-neutral-900/80 px-4 py-2.5 text-sm outline-none focus:border-red-400"
			placeholder="Funny sci-fi, cozy mystery…"
		/>
		<button
			class="rounded-lg bg-red-700 px-4 text-sm font-semibold hover:bg-red-600"
			disabled={loading}
		>
			Deal
		</button>
	</form>

	<div class="relative min-h-[570px]">
		{#if loading}
			<div
				class="grid min-h-[520px] place-items-center rounded-3xl border border-white/10 bg-neutral-900/70"
			>
				<p class="animate-pulse text-white/60">Shuffling the deck…</p>
			</div>
		{:else if error}
			<div
				class="grid min-h-[360px] place-items-center rounded-3xl border border-red-400/20 bg-neutral-900/70 p-8 text-center"
			>
				<p class="text-red-100">{error}</p>
			</div>
		{:else if current}
			<article
				class="touch-none select-none overflow-hidden rounded-3xl border border-white/15 bg-neutral-900 shadow-2xl transition-transform"
				class:duration-200={!dragging}
				style:transform={`translateX(${dragX}px) rotate(${dragX / 24}deg)`}
				onpointerdown={pointerDown}
				onpointermove={pointerMove}
				onpointerup={pointerUp}
				onpointercancel={pointerUp}
			>
				<div class="relative h-[390px] bg-neutral-800">
					{#if current.Poster && current.Poster !== 'N/A'}
						<img
							class="h-full w-full object-cover"
							src={current.Poster}
							alt={`Poster for ${current.Title}`}
							draggable="false"
						/>
					{/if}
					<div
						class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-neutral-950 to-transparent"
					></div>
					{#if Math.abs(dragX) > 25}
						<span
							class={`absolute top-6 rounded-lg border-2 px-3 py-1 text-xl font-black uppercase ${dragX > 0 ? 'right-6 border-emerald-400 text-emerald-300' : 'left-6 border-red-400 text-red-300'}`}
						>
							{dragX > 0 ? 'Save' : 'Pass'}
						</span>
					{/if}
				</div>
				<div class="p-6">
					<div class="flex items-baseline justify-between gap-4">
						<h2 class="text-2xl font-bold">{current.Title}</h2>
						<span class="text-white/60">{current.Year}</span>
					</div>
					<p class="mt-1 text-sm text-red-200/80">
						{current.Genre} · ★ {current.imdbRating ?? 'N/A'}
					</p>
					<p class="mt-4 line-clamp-3 text-sm leading-relaxed text-white/75">{current.Plot}</p>
				</div>
			</article>

			<div class="mt-5 flex justify-center gap-5">
				<button
					onclick={() => choose(false)}
					class="grid h-14 w-14 place-items-center rounded-full border border-white/15 bg-neutral-900 text-2xl text-red-300 shadow-lg hover:bg-neutral-800"
					aria-label="Pass on this movie">×</button
				>
				<button
					onclick={() => choose(true)}
					class="grid h-14 w-14 place-items-center rounded-full border border-emerald-400/30 bg-emerald-950 text-2xl text-emerald-300 shadow-lg hover:bg-emerald-900"
					aria-label="Save this movie">♥</button
				>
			</div>
		{:else}
			<div
				class="grid min-h-[360px] place-items-center rounded-3xl border border-white/10 bg-neutral-900/70 p-8 text-center"
			>
				<div>
					<h2 class="text-2xl font-semibold">That’s the deck.</h2>
					<p class="mt-2 text-white/60">Change the mood and deal again.</p>
				</div>
			</div>
		{/if}
	</div>

	{#if saved.length}
		<section class="mt-10 border-t border-white/10 pt-6">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-xl font-semibold">Shortlist ({saved.length})</h2>
				<button onclick={clearSaved} class="text-xs text-white/50 hover:text-white">Clear</button>
			</div>
			<div class="flex gap-3 overflow-x-auto pb-3">
				{#each saved as movie (movie.imdbID)}
					<a
						href={`https://www.imdb.com/title/${movie.imdbID}`}
						target="_blank"
						rel="noreferrer"
						class="w-32 flex-none"
					>
						{#if movie.Poster && movie.Poster !== 'N/A'}<img
								src={movie.Poster}
								alt=""
								class="h-44 w-32 rounded-lg object-cover"
							/>{/if}
						<p class="mt-2 truncate text-sm font-medium">{movie.Title}</p>
					</a>
				{/each}
			</div>
		</section>
	{/if}
</section>
