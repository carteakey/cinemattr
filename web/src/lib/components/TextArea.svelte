<script>
	/**
	 * @type string;
	 */
	export let value = '';
	export let placeholder = '';

	function handleChange(
		/** @type {Event & { currentTarget: EventTarget & HTMLTextAreaElement }} */ event
	) {
		value = event.currentTarget.value;
	}
</script>

<textarea
	class="w-full min-h-[120px] resize-y rounded-lg border border-white/20 bg-neutral-900/60 px-4 py-3 text-base text-white placeholder:text-white/40 shadow-inner backdrop-blur-sm transition focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-red-400/40"
	{value}
	{placeholder}
	on:input={handleChange}
/>
