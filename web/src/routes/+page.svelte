<script>
	import Textarea from '../lib/components/TextArea.svelte';
	import LoadingCard from '../lib/components/LoadingCard.svelte';
	import MovieCard from '../lib/components/MovieCard.svelte';
	import Spinner from '../lib/components/Spinner.svelte';
	import Button from '../lib/components/Button.svelte';
	import { SSE } from 'sse.js';
	export let query = '';
	export let placeholder = 'A mind-bending thriller about dreams within dreams...';
	import { fade } from 'svelte/transition';

	/** @typedef {{ titles?: string[]; message?: string; error?: { message?: string; status?: number } }} SearchResponse */
	/** @type {Promise<SearchResponse>} */
	let promise = Promise.resolve({});
	let errorMessage = '';
	let promptErrorMessage = '';

	async function getMovies() {
		errorMessage = '';
		promptErrorMessage = '';
		const response = await fetch('/api/getResults', {
			method: 'POST',
			body: JSON.stringify({ query }),
			headers: {
				'content-type': 'application/json'
			}
		});

		/** @type {SearchResponse} */
		let results = await response.json();
		if (!response.ok) {
			errorMessage = results?.error?.message ?? 'Error in getting results. Try again.';
			return results;
		}
		return results;
	}

	async function handleClick() {
		promise = getMovies();
	}

	let searching = false;
	$: {
		searching = true;
		promise.then(() => {
			searching = false;
		});
	}

	let proompting = false;
	async function getRandomPrompt() {
		query = '';
		proompting = true;
		promptErrorMessage = '';
		const source = new SSE('/api/getRandomPrompt', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
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
	<section in:fade class="pt-4 pb-6">
		<h1 class="text-center font-semibold tracking-tight text-4xl md:text-5xl leading-tight">
			Search for movies <span class="text-red-400/90">with AI</span>
		</h1>
		<p class="text-center text-white/60 text-sm md:text-base mt-3 max-w-xl mx-auto">
			Describe a plot, a mood, or a scene. Get a shortlist.
		</p>

		<div class="mt-6 flex flex-col gap-3">
			<Textarea bind:value={query} bind:placeholder />
		</div>

		<div class="flex flex-row gap-3 justify-center mt-5">
			<Button variant="primary" disabled={searching || !query.trim()} on:click={handleClick}>
				{#if searching}
					<Spinner size="sm" label="Searching" />
					<span>Searching…</span>
				{:else}
					<span>Go</span>
				{/if}
			</Button>

			<Button variant="secondary" disabled={proompting} on:click={getRandomPrompt}>
				{#if proompting}
					<Spinner size="sm" label="Generating prompt" />
					<span>Generating…</span>
				{:else}
					<span>Random prompt</span>
				{/if}
			</Button>
		</div>
	</section>

	{#await promise}
		<div class="grid md:grid-cols-2 gap-3">
			{#each { length: 20 } as _, i}
				<LoadingCard />
			{/each}
		</div>
	{:then data}
		{#if data.titles && data.titles.length > 0}
			<div class="grid md:grid-cols-2 gap-3">
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
			<div class="h-50" />
		{/if}
	{:catch error}
		<p class="text-center text-base text-white/60 italic mt-8">{error.message}</p>
	{/await}
</div>
