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

<div>
	<section
		in:fade
		class="grid items-center gap-10 pb-14 pt-3 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-8"
	>
		<div>
			<div class="mb-5 flex items-center gap-3">
				<span class="h-px w-8 bg-red-400"></span>
				<p class="eyebrow">A movie search engine for curious minds</p>
			</div>
			<h1
				class="display-type max-w-2xl text-balance text-5xl font-bold leading-[0.94] tracking-[-0.055em] text-[#eee2c9] sm:text-7xl lg:text-[5.4rem]"
			>
				What are we <span class="relative whitespace-nowrap"
					>watching?<span class="absolute -bottom-2 left-0 h-1 w-full -rotate-1 bg-red-500/75"
					></span></span
				>
			</h1>
			<p class="mt-6 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
				Describe the movie stuck in your head—or the one you wish existed. We’ll dig through the
				shelves.
			</p>

			<div class="surface mt-7 p-2 text-left sm:p-3">
				<div
					class="flex items-center justify-between border-b border-[#4e4038]/25 px-4 py-2 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#5a4339]"
				>
					<span>Tell us what you’re looking for</span><span class="text-red-800/65">No. 002187</span
					>
				</div>
				<Textarea bind:value={query} {placeholder} />
			</div>
			<div class="mt-5 flex gap-3">
				<Button variant="primary" disabled={searching || !query.trim()} onclick={handleClick}>
					{#if searching}
						<Spinner size="sm" label="Searching" /><span>Searching…</span>
					{:else}
						<span>Find it</span><span aria-hidden="true">→</span>
					{/if}
				</Button>
				<Button variant="secondary" disabled={proompting} onclick={getRandomPrompt}>
					{#if proompting}
						<Spinner size="sm" label="Generating prompt" /><span>Generating…</span>
					{:else}
						<span aria-hidden="true">◆</span><span>Roll the dice</span>
					{/if}
				</Button>
			</div>
		</div>

		<div class="film-still relative mx-auto hidden w-full max-w-md lg:block" aria-hidden="true">
			<div
				class="absolute -left-5 top-12 z-10 -rotate-6 border-2 border-[#bc4058] bg-[#29141d] px-4 py-3 font-mono text-xs uppercase leading-relaxed tracking-wider text-[#dd6679] shadow-lg"
			>
				Late nights.<br />Good films.<br />Strange beauty.
			</div>
			<div
				class="rotate-2 border-[10px] border-[#e7dac0] bg-[#e7dac0] p-1 shadow-[12px_14px_0_rgba(0,0,0,0.35)]"
			>
				<img
					src="/mismash.png"
					alt=""
					class="aspect-[4/5] w-full object-cover object-center saturate-[0.8] contrast-110"
				/>
			</div>
			<div
				class="ticket-cut absolute -bottom-5 -right-5 rotate-3 bg-[#d58d26] px-5 py-3 text-center font-mono text-[0.65rem] font-bold uppercase leading-tight tracking-wider text-[#271910] shadow-lg"
			>
				Curated by humans<br />not algorithms
			</div>
			<div class="absolute -right-3 top-8 h-16 w-5 rotate-6 bg-amber-100/35"></div>
		</div>
	</section>

	{#await promise}
		<div class="grid gap-4 md:grid-cols-2">
			{#each Array.from({ length: 20 }, (_, index) => index) as index}
				<div class="contents" data-loading-card={index}>
					<LoadingCard />
				</div>
			{/each}
		</div>
	{:then data}
		{#if data.titles && data.titles.length > 0}
			<div class="mb-4 flex items-end justify-between border-b-2 border-amber-100/15 pb-4">
				<div>
					<p class="eyebrow mb-1">Now screening</p>
					<h2 class="display-type text-2xl font-bold text-[#eee2c9]">Your shortlist</h2>
				</div>
				<p class="text-xs text-white/40">{Array.from(new Set(data.titles)).length} matches</p>
			</div>
			<div class="grid gap-4 md:grid-cols-2">
				{#each Array.from(new Set(data.titles)) as title_id}
					<div class="flex flex-col">
						<MovieCard {title_id} />
					</div>
				{/each}
			</div>
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
			<div class="h-50"></div>
		{/if}
	{:catch error}
		<p class="text-center text-base text-white/60 italic mt-8">{error.message}</p>
	{/await}
</div>
