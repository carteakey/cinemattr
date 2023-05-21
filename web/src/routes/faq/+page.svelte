<script>
	import { slide } from 'svelte/transition';
    import { fade } from 'svelte/transition';

	let faqs = [
		{ question: 'What does the app do?', answer: 'Answer 1' },
		{ question: 'Question 2', answer: 'Answer 2' }
		// Add more FAQ objects as needed
	];

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
				<div class="border border-gray-200 rounded p-4  font-medium">
					<button class="flex justify-between w-full  " on:click={() => toggleFAQ(index)}>
						<span class="text-lg font-medium">{faq.question}</span>
						<span class="">{activeIndex === index ? '-' : '+'}</span>
					</button>
					{#if activeIndex === index}
						<p transition:slide class="border-t py-2 text-neutral-200 border-white mt-2">{faq.answer}</p>
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
