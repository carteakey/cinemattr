<script>
	import { slide } from 'svelte/transition';
	import { fade } from 'svelte/transition';
	import { faqs } from '$lib/faqs';

	let activeIndex = null;

	function toggleFAQ(index) {
		activeIndex = activeIndex === index ? null : index;
	}
</script>

<div in:fade>
	<div class=" justify-center items-center">
		<h1 class="text-4xl text-center p-4">FAQ</h1>
		<div class="flex flex-col gap-2">
			{#each faqs as faq, index}
				<div class="border border-gray-200 rounded p-4 font-medium bg-neutral-800/70">
					<button class="flex justify-between w-full" on:click={() => toggleFAQ(index)}>
						<span class="text-lg font-medium text-left">{faq.question}</span>
						<span class="">{activeIndex === index ? '-' : '+'}</span>
					</button>
					{#if activeIndex === index}
						<p
							transition:slide
							class=" text-slate-200/90 border-t py-2 px-2 border-white mt-2 whitespace-pre-line"
						>
						{@html faq.answer}
						</p>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.border {
		transition: border-color 0.2s ease;
	}

	.border-gray-200 {
		border-color: #edf2f7;
	}

	.border-gray-200:hover,
	.border-gray-200:focus {
		border-color: #cbd5e0;
	}

	.text-lg {
		font-size: 1.125rem;
	}
</style>
