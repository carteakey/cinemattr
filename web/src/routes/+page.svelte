<script>
	import Textarea from '../lib/components/TextArea.svelte';
	import LoadingCard from '../lib/components/LoadingCard.svelte';
	import MovieCard from '../lib/components/MovieCard.svelte';
	import Spinner from '../lib/components/Spinner.svelte';
	import Button from '../lib/components/Button.svelte';
	import { SSE } from 'sse.js';
	import { fade } from 'svelte/transition';

	/** @typedef {{ titles?: string[]; message?: string; error?: { message?: string; status?: number } }} SearchResponse */

	let query = $state('');
	let placeholder = $state('A mind-bending thriller about dreams within dreams...');
	/** @type {Promise<SearchResponse>} */
	let promise = $state(Promise.resolve({}));
	let errorMessage = $state('');
	let promptErrorMessage = $state('');
	let searching = $state(false);
	let proompting = $state(false);
	const characterLimit = 400;
	const queryLength = $derived(query.length);

	const filmFrames = [
		{ label: '7A', className: 'frame-wide', position: '0% 0%' },
		{ label: '8A', className: 'frame-wide', position: '50% 0%' },
		{ label: '9A', className: '', position: '100% 0%' },
		{ label: '10', className: '', position: '0% 50%' },
		{ label: '8A', className: 'frame-wide', position: '50% 50%' },
		{ label: '9A', className: '', position: '100% 50%' },
		{ label: '10', className: '', position: '0% 100%' },
		{ label: '11A', className: 'frame-wide', position: '50% 100%' },
		{ label: '12A', className: '', position: '100% 100%' }
	];

	const nowScreening = [
		{
			title: 'In the Mood for Love',
			imdbID: 'tt0118694',
			meta: '2000 · Romance · 1h 38m',
			description: 'Neighbors in 1960s Hong Kong orbit love, restraint, and suspicion.',
			tag: 'Longing',
			position: '0% 50%',
			swatches: ['#b11d32', '#17202c', '#d3a757', '#0b3c33']
		},
		{
			title: 'Mulholland Drive',
			imdbID: 'tt0166924',
			meta: '2001 · Mystery · 2h 27m',
			description: 'A Hollywood dream folds into identity, dread, and obsession.',
			tag: 'Dreamlike',
			position: '50% 50%',
			swatches: ['#a74522', '#24364a', '#071616', '#c2a15b']
		},
		{
			title: 'Moon',
			imdbID: 'tt1182345',
			meta: '2009 · Sci-Fi · 1h 37m',
			description: 'A lone lunar worker nears the end of a very strange contract.',
			tag: 'Isolated',
			position: '100% 0%',
			swatches: ['#7e1f3b', '#1e2a37', '#d6c08c', '#101b18']
		},
		{
			title: 'Before Sunrise',
			imdbID: 'tt0112471',
			meta: '1995 · Romance · 1h 41m',
			description: 'Two strangers spend one night walking, talking, and almost missing it.',
			tag: 'Tender',
			position: '50% 100%',
			swatches: ['#9b2e24', '#16253a', '#c8a25d', '#12352d']
		},
		{
			title: 'The Handmaiden',
			imdbID: 'tt4016934',
			meta: '2016 · Thriller · 2h 25m',
			description: 'A con game becomes desire, revenge, and exquisite misdirection.',
			tag: 'Lush',
			position: '50% 50%',
			swatches: ['#8f1724', '#1a2531', '#d9b56b', '#142d21']
		},
		{
			title: 'Cure',
			imdbID: 'tt0123948',
			meta: '1997 · Horror · 1h 51m',
			description: 'A detective follows murders that feel less solved than transmitted.',
			tag: 'Unsettling',
			position: '100% 50%',
			swatches: ['#a44b1f', '#15263a', '#d3b26f', '#111f1a']
		}
	];

	$effect(() => {
		searching = true;
		promise.then(() => {
			searching = false;
		});
	});

	async function getMovies() {
		errorMessage = '';
		promptErrorMessage = '';
		const response = await fetch('/api/getResults', {
			method: 'POST',
			body: JSON.stringify({ query }),
			headers: { 'content-type': 'application/json' }
		});

		/** @type {SearchResponse} */
		const results = await response.json();
		if (!response.ok) {
			errorMessage = results?.error?.message ?? 'Error in getting results. Try again.';
		}
		return results;
	}

	function handleClick() {
		promise = getMovies();
	}

	async function getRandomPrompt() {
		query = '';
		proompting = true;
		promptErrorMessage = '';
		const source = new SSE('/api/getRandomPrompt', {
			method: 'GET',
			headers: { 'content-type': 'application/json' }
		});

		function stopPrompting(message = '') {
			proompting = false;
			promptErrorMessage = message;
			source.close?.();
		}

		source.addEventListener('message', function (e) {
			const messageEvent = /** @type {MessageEvent} */ (e);
			if (messageEvent.data === '[DONE]') {
				stopPrompting();
				return;
			}

			let payload;
			try {
				payload = JSON.parse(messageEvent.data);
			} catch {
				stopPrompting('Unable to generate a random prompt right now.');
				return;
			}

			const [{ delta } = { delta: {} }] = payload.choices ?? [];
			if (delta.content) {
				query = (query ?? '') + delta.content;
			}
		});
		source.addEventListener('error', function () {
			stopPrompting('Unable to generate a random prompt right now.');
		});

		try {
			source.stream();
		} catch {
			stopPrompting('Unable to generate a random prompt right now.');
		}
	}
</script>

<div class="cinema-workbench">
	<section
		in:fade
		class="relative grid items-start gap-10 pb-8 pt-1 lg:grid-cols-[minmax(29rem,0.86fr)_minmax(36rem,1.14fr)] lg:gap-10 xl:pb-10"
	>
		<div class="hero-panel relative z-10">
			<div class="mb-5 flex items-center gap-3">
				<span class="h-px w-8 bg-red-400"></span>
				<p class="eyebrow">A natural-language movie search engine</p>
			</div>
			<h1
				class="display-type max-w-2xl text-balance text-5xl font-bold leading-[0.94] tracking-normal text-[#eee2c9] sm:text-7xl lg:text-[5.6rem] xl:text-[6.55rem]"
			>
				What are we <span class="relative whitespace-nowrap"
					>watching?<span class="absolute -bottom-2 left-0 h-1 w-full -rotate-1 bg-red-500/75"
					></span></span
				>
			</h1>
			<p class="mt-6 max-w-lg font-mono text-sm leading-relaxed text-[#eee2c9]/78 sm:text-base">
				Describe the movie stuck in your head, or the one you wish existed.
			</p>

			<div class="surface notes-card mt-7 p-2 text-left sm:p-3">
				<div
					class="flex items-center justify-between border-b border-[#4e4038]/25 px-4 py-2 font-mono text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#5a4339]"
				>
					<span>Scene / Notes</span><span class="text-red-800/65"
						>{queryLength}/{characterLimit}</span
					>
				</div>
				<Textarea bind:value={query} {placeholder} maxlength={characterLimit} />
			</div>
			<div class="mt-5 flex flex-col gap-3 min-[440px]:flex-row">
				<Button
					variant="primary"
					ticketCode="011320"
					disabled={searching || !query.trim()}
					onclick={handleClick}
				>
					{#if searching}
						<Spinner size="sm" label="Searching" /><span>Searching…</span>
					{:else}
						<span>Find it</span><span aria-hidden="true">→</span>
					{/if}
				</Button>
				<Button
					variant="secondary"
					ticketCode="81764"
					disabled={proompting}
					onclick={getRandomPrompt}
				>
					{#if proompting}
						<Spinner size="sm" label="Generating prompt" /><span>Generating…</span>
					{:else}
						<span aria-hidden="true">◆</span><span>Roll the dice</span>
					{/if}
				</Button>
			</div>
			<div
				class="mt-5 flex flex-wrap items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.14em]"
			>
				<span class="border-b border-amber-300/50 pb-1 text-amber-200/70"
					>Search by feeling, not filters</span
				>
				<span class="border border-red-400/35 px-2 py-1 text-red-300/70"
					>AI-assisted semantic search</span
				>
			</div>
		</div>

		<div class="contact-sheet relative hidden min-h-[35rem] lg:block" aria-hidden="true">
			<div
				class="absolute left-[7%] top-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#d16f20]"
			>
				Kodak Portra 400
			</div>
			<div class="filmstrip-grid">
				{#each filmFrames as frame}
					<div
						class={`filmstrip-frame ${frame.className}`}
						style={`--frame-position: ${frame.position}`}
					>
						<span>{frame.label}</span>
					</div>
				{/each}
			</div>
			<div class="tape tape-one"></div>
			<div class="tape tape-two"></div>
			<div class="ticket-cut admit-stub">Admit<br />One</div>
			<div class="reel-note">Check changeover<br />reel 3</div>
		</div>
	</section>

	{#await promise}
		<section class="screening-shelf mb-8">
			<div class="mb-3 flex items-end justify-between gap-4 border-b border-amber-100/20 pb-2">
				<div class="flex items-center gap-3">
					<p class="font-mono text-sm uppercase tracking-[0.14em] text-[#eee2c9]">Threading Reel</p>
					<span class="hidden h-px w-24 bg-amber-100/20 sm:block"></span>
				</div>
				<p class="font-mono text-xs uppercase tracking-[0.16em] text-red-300/75">Searching...</p>
			</div>
			<div class="grid gap-4 md:grid-cols-2">
				{#each Array.from({ length: 6 }, (_, index) => index) as index}
					<div class="contents" data-loading-card={index}>
						<LoadingCard />
					</div>
				{/each}
			</div>
		</section>
	{:then data}
		{#if data.titles && data.titles.length > 0}
			<section class="screening-shelf mb-8">
				<div class="mb-4 flex items-end justify-between border-b border-amber-100/20 pb-3">
					<div>
						<p class="font-mono text-sm uppercase tracking-[0.14em] text-[#eee2c9]">
							Now Screening
						</p>
						<h2 class="display-type mt-1 text-2xl font-bold text-[#eee2c9]">Search results</h2>
					</div>
					<p class="font-mono text-xs uppercase tracking-[0.16em] text-red-300/75">
						{Array.from(new Set(data.titles)).length} matches
					</p>
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					{#each Array.from(new Set(data.titles)) as title_id}
						<div class="flex flex-col">
							<MovieCard {title_id} />
						</div>
					{/each}
				</div>
			</section>
		{/if}

		{#if data.titles && data.titles.length === 0}
			<p class="text-center text-base text-white/60 italic mt-8">
				No titles found. Try a different prompt.
			</p>
		{/if}

		{#if data.message === 'Internal Server Error'}
			<p class="text-center text-base text-white/60 italic mt-8">
				Error in getting results. Try again.
			</p>
		{/if}

		{#if data.error}
			<p class="text-center text-base text-white/60 italic mt-8">
				{errorMessage || data.error.message}
			</p>
		{/if}

		{#if promptErrorMessage}
			<p class="text-center text-base text-white/60 italic mt-8">
				{promptErrorMessage}
			</p>
		{/if}

		{#if errorMessage && !data.error}
			<p class="text-center text-base text-white/60 italic mt-8">
				{errorMessage}
			</p>
		{/if}

		{#if !data.titles}
			<section class="screening-shelf mb-8">
				<div class="mb-3 flex items-end justify-between gap-4 border-b border-amber-100/20 pb-2">
					<div class="flex items-center gap-3">
						<p class="font-mono text-sm uppercase tracking-[0.14em] text-[#eee2c9]">
							Now Screening
						</p>
						<span class="hidden h-px w-24 bg-amber-100/20 sm:block"></span>
					</div>
					<a
						href="/discover"
						class="font-mono text-xs uppercase tracking-[0.16em] text-red-300/75 transition hover:text-red-200"
						>Discover →</a
					>
				</div>
				<div class="screening-track">
					{#each nowScreening as movie}
						<a
							class="screening-card"
							href={`https://www.imdb.com/title/${movie.imdbID}`}
							target="_blank"
							rel="noreferrer"
							aria-label={`Open ${movie.title} on IMDb`}
						>
							<div class="screening-still" style={`--still-position: ${movie.position}`}></div>
							<div class="screening-copy">
								<h2>{movie.title}</h2>
								<p class="screening-meta">{movie.meta}</p>
								<p class="screening-desc">{movie.description}</p>
								<div class="screening-foot">
									<div class="swatches" aria-hidden="true">
										{#each movie.swatches as swatch}
											<span style={`background: ${swatch}`}></span>
										{/each}
									</div>
									<span>{movie.tag}</span>
								</div>
							</div>
						</a>
					{/each}
				</div>
			</section>
		{/if}
	{:catch error}
		<p class="text-center text-base text-white/60 italic mt-8">{error.message}</p>
	{/await}
</div>
