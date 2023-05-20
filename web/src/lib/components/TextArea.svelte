<script>
	/**
	 * @type string;
	 */
	export let value = '';
	export let placeholder = '';

	function handleChange(event) {
		value = event.target.value;
	}
</script>

<textarea
	class="border border-gray-300 rounded-md p-2 py-2 bg-neutral-800/70 shadow-md backdrop-blur-sm"
	{value}
	{placeholder}
	on:input={handleChange}
/>
