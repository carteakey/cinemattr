<script>
	import { fade } from 'svelte/transition';
	/**
	 * @type string
	 */
	export let title_id;

	async function getMovieInfo() {
		const response = await fetch('/api/getDetails', {
			method: 'POST',
			body: JSON.stringify({ title_id: title_id }),
			headers: {
				'content-type': 'application/json'
			}
		});
		let MovieInfo = await response.json();
		return MovieInfo;
	}

	let promise = getMovieInfo();
</script>

<div>
	{#await promise}
		<!-- <LoadingCard incomingStream={false} /> -->
	{:then data}
		<div in:fade class="relative flex flex-col md:flex-row bg-neutral-800/70 shadow-md p-6">
			<div
				class="hidden md:block h-[250px] flex-none w-2/5 bg-cover bg-center"
				style={`background-image: url(${data.Poster})`}
			/>
			<div
				class="md:hidden z-10 absolute inset-0 bg-cover bg-center"
				style={`background-image: url(${data.Poster})`}
			/>

			<div class=" flex flex-col justify-between md:ml-6 pt-32 md:pt-0">
				<div>
					<div class="flex items-end mb-4">
						<div class="font-bold text-slate-200 text-lg">
							<a target="_blank" href="https://www.imdb.com/title/{title_id}" rel="noreferrer"
								>{data.Title}</a
							>
							<span class="font-bold text-slate-200/60 text-lg ml-2">{data.Year}</span>
						</div>
					</div>
					<div class="text-slate-200/90 mb-4 text-sm line-clamp-4">
						{data.Plot}
					</div>
					<!-- <div class="text-slate-200/50 mb-4">
							Starring: {data.Actors}
						</div> -->
				</div>
			</div>
		</div>
	{/await}
</div>
