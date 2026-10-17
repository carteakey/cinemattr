<script>
	import { onMount } from 'svelte';

	/** @typedef {{ imdbID: string, Title: string, Year?: string, Genre?: string, Plot?: string, Poster?: string, imdbRating?: string }} Movie */
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
	let moodLength = $derived(mood.length);
	let reelNumber = $derived(movies.length ? Math.min(index + 1, movies.length) : 1);
	let queue = $derived(
		movies
			.slice(index + 1)
			.filter((movie) => !saved.some((savedMovie) => savedMovie.imdbID === movie.imdbID))
			.slice(0, 4)
	);

	const fallbackPositions = ['0% 0%', '50% 0%', '100% 0%', '0% 50%', '50% 50%', '100% 50%'];

	onMount(() => {
		try {
			const stored = JSON.parse(localStorage.getItem('cinemattr-shortlist') ?? '[]');
			saved = Array.isArray(stored) ? stored.filter((movie) => movie?.imdbID && movie?.Title) : [];
		} catch {
			saved = [];
		}
		loadDeck();
	});

	async function loadDeck() {
		if (!mood.trim()) return;
		loading = true;
		error = '';
		index = 0;
		dragX = 0;
		movies = [];

		try {
			const search = await fetch('/api/getResults', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ query: mood.trim() })
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
			try {
				localStorage.setItem('cinemattr-shortlist', JSON.stringify(saved));
			} catch {
				// Shortlisting still works for the current session when storage is unavailable.
			}
		}
		dragX = 0;
		index += 1;
	}

	/** @param {KeyboardEvent} event */
	function handleKey(event) {
		const target = event.target;
		if (
			target instanceof HTMLInputElement ||
			target instanceof HTMLTextAreaElement ||
			target instanceof HTMLSelectElement
		) {
			return;
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			choose(false);
		}
		if (event.key === 'ArrowRight') {
			event.preventDefault();
			choose(true);
		}
	}

	/** @param {PointerEvent} event */
	function pointerDown(event) {
		if (event.target instanceof HTMLAnchorElement) return;
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

	/** @param {Movie} movie */
	function genreLabel(movie) {
		return (movie.Genre ?? 'Feature film').replace(/,\s*/g, ' / ');
	}

	/** @param {Movie} movie */
	function ratingLabel(movie) {
		return movie.imdbRating && movie.imdbRating !== 'N/A' ? movie.imdbRating : '—';
	}

	/** @param {Movie} movie */
	function hasPoster(movie) {
		return Boolean(movie.Poster && movie.Poster !== 'N/A');
	}

	/** @param {Movie} movie */
	function posterPosition(movie) {
		const movieIndex = movies.findIndex((candidate) => candidate.imdbID === movie.imdbID);
		return fallbackPositions[Math.max(movieIndex, 0) % fallbackPositions.length];
	}
</script>

<svelte:window onkeydown={handleKey} />

<section class="discover-page pb-16 pt-2 sm:pt-4">
	<div class="discover-intro mb-5 flex items-end justify-between gap-4">
		<div class="flex items-center gap-3">
			<span class="h-px w-8 bg-red-400/80"></span>
			<p class="eyebrow">A natural-language movie match desk</p>
		</div>
		<p
			class="hidden font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#d9b46b]/60 lg:block"
		>
			35mm &nbsp; 24fps &nbsp; 1.85:1
		</p>
	</div>

	<div class="discover-grid">
		<aside class="discover-brief surface">
			<div class="discover-paper-heading">
				<span>Movie match</span>
				<span class="text-[#8f2528]/60">A–113</span>
			</div>
			<h1
				class="display-type mt-6 text-[2.05rem] font-bold leading-[0.96] text-[#2f211c] sm:text-[2.35rem]"
			>
				What should we watch?
			</h1>
			<p class="discover-brief-label mt-7">Describe the mood, plot, or genre</p>
			<form
				class="mt-2"
				onsubmit={(event) => {
					event.preventDefault();
					loadDeck();
				}}
			>
				<label class="sr-only" for="discover-mood">Describe the mood, plot, or genre</label>
				<textarea
					id="discover-mood"
					bind:value={mood}
					maxlength="400"
					class="discover-mood-input"
					placeholder="surprising, highly rated movies with memorable plots"
				></textarea>
				<div class="mt-1 flex justify-end font-mono text-[0.56rem] text-[#654b3c]/65">
					{moodLength}/400
				</div>
				<button
					type="submit"
					class="ticket-cut action-ticket discover-deal-button mt-5 w-full"
					data-ticket-code="081428"
					disabled={loading || !mood.trim()}
				>
					<span class="text-[1.7rem] leading-none" aria-hidden="true">★</span>
					<span>{loading ? 'Shuffling the deck' : 'Deal'}</span>
					<span class="text-[1.7rem] leading-none" aria-hidden="true">★</span>
				</button>
			</form>

			<div class="discover-shortcuts mt-6" aria-label="Keyboard shortcuts">
				<div><b>↑</b><span>Next movie</span></div>
				<div><b>←</b><span>Pass</span></div>
				<div><b>→</b><span>Save</span></div>
				<div><b>?</b><span>Keyboard shortcuts</span></div>
			</div>
			<div class="discover-scribble" aria-hidden="true">7A</div>
		</aside>

		<section class="discover-deck-column" aria-label="Movie deck">
			<div class="discover-card-wrap">
				<div class="deck-card-back deck-card-back-far" aria-hidden="true"></div>
				<div class="deck-card-back deck-card-back-near" aria-hidden="true"></div>

				{#if loading}
					<div class="discover-card discover-loading-card" role="status" aria-live="polite">
						<div class="discover-loading-mark">◌</div>
						<p>Shuffling the deck</p>
						<span>Reading the room…</span>
					</div>
				{:else if error}
					<div class="discover-card discover-empty-card" role="alert">
						<p class="discover-card-kicker">Reel jam</p>
						<h2 class="display-type">The projector coughed.</h2>
						<p>{error}</p>
						<button type="button" class="discover-retry-button" onclick={loadDeck}
							>Deal again</button
						>
					</div>
				{:else if current}
					<article
						class="discover-card discover-current-card touch-none select-none"
						class:discover-card-dragging={dragging}
						style:transform={`translateX(${dragX}px) rotate(${dragX / 32}deg)`}
						onpointerdown={pointerDown}
						onpointermove={pointerMove}
						onpointerup={pointerUp}
						onpointercancel={pointerUp}
					>
						<div class="discover-card-topline">
							<span>Reel {reelNumber} of {movies.length}</span>
							<span class="discover-holes" aria-hidden="true">
								<i></i><i></i><i></i><i></i>
							</span>
						</div>
						<div class="discover-card-content">
							<div
								class="discover-poster"
								class:discover-poster-fallback={!hasPoster(current)}
								style={!hasPoster(current)
									? `--poster-position: ${posterPosition(current)}`
									: undefined}
							>
								{#if hasPoster(current)}
									<img src={current.Poster} alt={`Poster for ${current.Title}`} draggable="false" />
								{:else}
									<span>cinemattr<br />archive</span>
								{/if}
								<div class="discover-poster-code" aria-hidden="true">{current.Year ?? '—'}</div>
							</div>
							<div class="discover-card-copy">
								<div class="discover-title-row">
									<h2 class="display-type">{current.Title}</h2>
									<span class="discover-card-number">{String(index + 1).padStart(2, '0')}</span>
								</div>
								<div class="discover-red-rule"></div>
								<p class="discover-year">{current.Year ?? 'Year unknown'}</p>
								<p class="discover-genre">{genreLabel(current)}</p>
								<div class="discover-rating-row">
									<span>{ratingLabel(current)}</span>
									<span aria-label={`IMDb rating ${ratingLabel(current)}`}>★★★★<i>★</i></span>
									<a
										href={`https://www.imdb.com/title/${current.imdbID}`}
										target="_blank"
										rel="noreferrer"
										onpointerdown={(event) => event.stopPropagation()}>IMDb ↗</a
									>
								</div>
								<p class="discover-plot">
									{current.Plot ?? 'A film waiting to be found in the dark.'}
								</p>
								<div class="discover-match-stamp">
									<span>Deck rank</span>
									<strong>#{String(index + 1).padStart(2, '0')}</strong>
								</div>
							</div>
						</div>
					</article>
				{:else}
					<div class="discover-card discover-empty-card">
						<p class="discover-card-kicker">Reel complete</p>
						<h2 class="display-type">That’s the deck.</h2>
						<p>Deal again for another set of films.</p>
						<button type="button" class="discover-retry-button" onclick={loadDeck}
							>Deal again</button
						>
					</div>
				{/if}
			</div>

			{#if current}
				<div class="discover-actions">
					<button
						type="button"
						class="ticket-cut action-ticket discover-action discover-pass"
						data-ticket-code={String(index + 23).padStart(2, '0')}
						onclick={() => choose(false)}
						aria-label="Pass on this movie"
					>
						<span aria-hidden="true">←</span> Pass
					</button>
					<span class="discover-arrow-hint">USE ← → OR KEYS</span>
					<button
						type="button"
						class="ticket-cut action-ticket discover-action discover-save"
						data-ticket-code={String(index + 23).padStart(2, '0')}
						onclick={() => choose(true)}
						aria-label="Save this movie"
					>
						Save <span aria-hidden="true">→</span>
					</button>
				</div>
			{/if}
		</section>

		<aside class="discover-rail">
			<div class="discover-rail-heading">
				<h2 aria-label={`Shortlist (${saved.length})`}>Shortlist</h2>
				<span>{saved.length} saved</span>
			</div>
			{#if saved.length}
				<div class="discover-shortlist-list">
					{#each saved.slice(-3).reverse() as movie (movie.imdbID)}
						<a
							class="discover-shortlist-card"
							href={`https://www.imdb.com/title/${movie.imdbID}`}
							target="_blank"
							rel="noreferrer"
						>
							<div
								class="discover-small-poster"
								class:discover-poster-fallback={!hasPoster(movie)}
								style={!hasPoster(movie)
									? `--poster-position: ${posterPosition(movie)}`
									: undefined}
							>
								{#if hasPoster(movie)}<img src={movie.Poster} alt="" />{/if}
							</div>
							<div class="discover-shortlist-copy">
								<h3>{movie.Title}</h3>
								<p>{movie.Year ?? '—'}</p>
								<span>{genreLabel(movie)}</span>
								<strong>{ratingLabel(movie)} ★★★★★</strong>
							</div>
							<i class="discover-save-dot" aria-hidden="true"></i>
						</a>
					{/each}
				</div>
			{:else}
				<div class="discover-empty-shortlist">
					<span aria-hidden="true">＋</span>
					<p>Save films from the deck and they’ll land here.</p>
				</div>
			{/if}

			<div class="discover-status">
				<div class="discover-rail-heading">
					<h2>Deck status</h2>
					<span>{movies.length ? `${reelNumber} / ${movies.length}` : '—'}</span>
				</div>
				<div class="discover-reel-status">
					<span>Reel {reelNumber} of {movies.length || 12}</span>
					<div aria-hidden="true">
						{#each Array(10) as dot, dotIndex}
							<i class:active={dotIndex < reelNumber} data-dot={dot}></i>
						{/each}
					</div>
				</div>
				<p class="discover-semantic-label">AI-assisted semantic search</p>
				{#if saved.length}
					<button type="button" class="discover-clear-button" onclick={clearSaved}
						>Clear shortlist</button
					>
				{/if}
			</div>
		</aside>
	</div>

	<section class="discover-queue" aria-label="Suggested films">
		<div class="discover-queue-heading">
			<div>
				<p>You might also save</p>
				<span>More frames from this reel</span>
			</div>
			<span class="discover-queue-code">KP 5246 4417 03</span>
		</div>
		{#if loading}
			<div class="discover-queue-track" aria-label="Loading suggested films">
				{#each Array(4) as skeletonIndex}
					<div class="discover-queue-skeleton" data-skeleton={skeletonIndex}></div>
				{/each}
			</div>
		{:else if queue.length}
			<div class="discover-queue-track">
				{#each queue as movie (movie.imdbID)}
					<a
						class="discover-queue-card"
						href={`https://www.imdb.com/title/${movie.imdbID}`}
						target="_blank"
						rel="noreferrer"
					>
						<div
							class="discover-queue-poster"
							class:discover-poster-fallback={!hasPoster(movie)}
							style={!hasPoster(movie) ? `--poster-position: ${posterPosition(movie)}` : undefined}
						>
							{#if hasPoster(movie)}<img src={movie.Poster} alt="" />{/if}
						</div>
						<div>
							<h3>{movie.Title}</h3>
							<p>{movie.Year ?? '—'} · {genreLabel(movie)}</p>
							<strong>{ratingLabel(movie)} ★★★★★</strong>
						</div>
						<span class="discover-add-mark" aria-hidden="true">＋</span>
					</a>
				{/each}
			</div>
		{:else}
			<div class="discover-queue-empty">
				<span>{movies.length ? 'End of reel.' : 'Deal a reel to load more frames.'}</span>
				{#if !movies.length && !error}<span class="animate-pulse">Preparing the projector…</span
					>{/if}
			</div>
		{/if}
	</section>
</section>
