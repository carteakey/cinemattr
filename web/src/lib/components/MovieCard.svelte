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
		<!-- {@debug data} -->
		<div in:fade class="flex flex-col md:flex-row bg-neutral-800/70 shadow-md p-4 md:p-6 items-center">
			<div
				class="h-[220px] md:h-[250px] flex-none w-2/5 md:w-2/5 md:bg-cover bg-center bg-cover"
				style={`background-image: url(${data.Poster})`}
			/>
			<div class="flex flex-col justify-between md:ml-6 pt-3 md:pt-0 p-2 md:p-0">
				<div>
					<div class="flex justify-between" >
						<div class="font-bold text-slate-200 text-md">
							{data.Title}
						</div>
						<span class="font-bold text-slate-200/60 text-md ml-2">{data.Year}</span>
					</div>
					<!-- <p class=" text-slate-200/50 ml-4 items-center text-sm">108 min</p> -->
					<div class="text-slate-200/50 italic mb-4 text-sm">
						{data.Genre}
					</div>

					<div class="text-slate-200/90 mb-4 text-sm line-clamp-4">
						{data.Plot}
					</div>
					<div class="text-slate-200/50 mb-4 text-sm line-clamp-2">
						Starring: {data.Actors}
					</div>
					<!-- <div class="text-slate-200/50 text-sm">
					Directed by: {data.Director}
				</div> -->
					<div class="flex flex-row justify-end gap-2 items-center">
						<p class="text-sm text-slate-200/90">{data.imdbRating}</p>

						<a
							target="_blank"
							href="https://www.imdb.com/title/{title_id}"
							rel="noreferrer"
							class="float-right flex items-center"
						>
							<img src="./IMDB.svg" alt="IMDb" class="w-10 h-10 mr-1" />
						</a>
					</div>
				</div>
			</div>
		</div>
	{/await}
</div>
