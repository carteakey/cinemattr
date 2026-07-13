<script>
	import { slide, fade } from 'svelte/transition';
	import { faqs } from '$lib/faqs';

	/** @type {number | null} */
	let activeIndex = $state(null);

	/** @param {number} index */
	function toggleFAQ(index) {
		activeIndex = activeIndex === index ? null : index;
	}
</script>

<div in:fade class="mx-auto max-w-3xl py-5 sm:py-10">
	<header class="mb-10 text-center">
		<p class="eyebrow mb-3">A little context</p>
		<h1 class="display-type text-4xl font-bold tracking-[-0.04em] text-[#eee2c9] sm:text-5xl">
			Frequently asked questions
		</h1>
		<p class="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/50">
			How cinemattr searches, what it knows, and what happens to your queries.
		</p>
	</header>
	<div class="flex flex-col gap-3">
		{#each faqs as faq, index}
			<div
				class="border-2 border-amber-100/15 bg-[#171116] p-5 shadow-[4px_4px_0_rgba(84,32,62,0.3)] transition hover:-translate-y-0.5 hover:border-amber-200/30"
			>
				<button
					class="flex w-full items-center justify-between gap-6"
					onclick={() => toggleFAQ(index)}
					aria-expanded={activeIndex === index}
				>
					<span class="text-left text-base font-medium sm:text-lg">{faq.question}</span>
					<span
						class="grid h-7 w-7 flex-none place-items-center rounded-full bg-white/[0.06] text-lg font-light text-white/50"
						>{activeIndex === index ? '−' : '+'}</span
					>
				</button>
				{#if activeIndex === index}
					<p
						transition:slide
						class="mt-4 whitespace-pre-line border-t border-white/10 pt-4 text-sm font-normal leading-relaxed text-white/60"
					>
						{faq.answer}
					</p>
				{/if}
			</div>
		{/each}
	</div>
</div>
