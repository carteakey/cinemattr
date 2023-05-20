<script>
	let faqs = [
		{ question: 'Question 1', answer: 'Answer 1' },
		{ question: 'Question 2', answer: 'Answer 2' }
		// Add more FAQ objects as needed
	];

	let activeIndex = null;

	function toggleFAQ(index) {
		activeIndex = activeIndex === index ? null : index;
	}
</script>

<div class="">
	{#each faqs as faq, index}
		<div class="border border-gray-200 rounded p-4">
			<button class="flex justify-between w-full" on:click={() => toggleFAQ(index)}>
				<span class="text-lg font-medium">{faq.question}</span>
				<span class="text-gray-600">{activeIndex === index ? '-' : '+'}</span>
			</button>
			{#if activeIndex === index}
				<p class="mt-2">{faq.answer}</p>
			{/if}
		</div>
	{/each}
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
