<script>
	import Textarea from '../lib/components/TextArea.svelte';
	import LoadingCard from '../lib/components/LoadingCard.svelte';
	import MovieCard from '../lib/components/MovieCard.svelte';
	import { SSE } from 'sse.js';
	export let query = '';
	export let placeholder = 'Enter any details about the movie...';
	import { fade } from 'svelte/transition';

	let promise = Promise.resolve([]);

	async function getMovies() {
		const response = await fetch('/api/getResults', {
			method: 'POST',
			body: JSON.stringify({ "query": query }),
			headers: {
				'content-type': 'application/json'
			}
		});

		console.log(response.status);
		console.log(response.statusText);

		if (response.status >= 500) {
			console.log('Error...');
			console.log(response);
			return {
				message: 'Internal Server Error'
			};
		}

		let results = await response.json();
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
			// setTimeout(() => {
			// 	searching = false;
			// }, 3000);
		});
	}

	let proompting = false;
	async function getRandomPrompt() {
		query = '';
		proompting = true;
		var source = new SSE('/api/getRandomPrompt', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		// console.log(source);
		source.addEventListener('message', function (e) {
			// console.log(e);
			if (e.data === '[DONE]') {
				//Wait for 10 seconds before allowing another request
				setTimeout(() => {
					proompting = false;
				}, 10000);

				return;
			}
			var payload = JSON.parse(e.data);
			const [{ delta }] = payload.choices;

			if (delta.content) {
				query = (query ?? '') + delta.content;
			}
		});
		source.stream();
	}
</script>

<div>
	<div in:fade class=" justify-center items-center">
		<h1 class="text-4xl text-center p-4">Search for movies with AI</h1>
		<div class="flex flex-col">
			<Textarea bind:value={query} bind:placeholder />
		</div>

		<div class="flex flex-row gap-2 justify-center mt-5 mb-5">
			{#if searching}
				<button
					disabled
					type="button"
					class="rounded-md border border-gray-300 backdrop-blur-lg bg-red-800/70 px-2 py-1 items-center flex"
				>
					<svg
						aria-hidden="true"
						role="status"
						class="inline w-5 h-5 mr-1 ml-1 text-white animate-spin"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="#E5E7EB"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentColor"
						/>
					</svg>
					<!-- Loading... -->
				</button>
			{:else}
				<button
					class="rounded-md border border-gray-300 backdrop-blur-lg bg-red-800/70 px-3 py-1 flex"
					disabled={searching}
					on:click={handleClick}>Go</button
				>
			{/if}

			{#if proompting}
				<button
					disabled
					type="button"
					class="rounded-md border border-gray-300 backdrop-blur-lg bg-blue-800/70 px-2 py-1 items-center flex"
				>
					<svg
						aria-hidden="true"
						role="status"
						class="inline w-5 h-5 mr-1 ml-1 text-white animate-spin"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="#E5E7EB"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentColor"
						/>
					</svg>
					<!-- Loading... -->
				</button>
			{:else}
				<button
					class="rounded-md border border-gray-300 backdrop-blur-lg bg-blue-800/70 px-3 py-1 flex"
					on:click={getRandomPrompt}
					disabled={proompting}>Random Prompt</button
				>
			{/if}
		</div>
	</div>

	{#await promise}
		<div class="grid md:grid-cols-2 gap-2">
			{#each { length: 20 } as _, i}
				<LoadingCard />
			{/each}
		</div>
	{:then data}
		<!-- {@debug data} -->
		{#if data.titles}
			<div class="grid md:grid-cols-2 gap-2">
				{#each Array.from(new Set(data.titles)) as title_id}
					<div class="flex flex-col">
						<MovieCard {title_id} />
					</div>
				{/each}
			</div>
		{/if}

		{#if data.titles}
			{#if data.titles.length == 0}
				<p class="text-center text-lg text-slate-200/90 italic">
					No titles found... Try again with a different prompt.
				</p>
			{/if}
		{/if}

		{#if data.message}
			{#if data.message == 'Internal Server Error'}
				<p class="text-center text-lg text-slate-200/90 italic">
					Error in getting results. Try again.
				</p>
			{/if}
		{/if}

		{#if !data.titles}
			<div class="h-50" />
		{/if}
	{:catch error}
		<p class="text-center text-lg text-slate-200/90 italic">{error.message}</p>
	{/await}
</div>
