<script>
	/** @type {{ value?: string, placeholder?: string, maxlength?: number }} */
	let { value = $bindable(''), placeholder = '', maxlength } = $props();
</script>

<textarea
	class="display-type min-h-[132px] w-full resize-none rounded-none border-0 bg-transparent px-4 py-3 text-lg leading-relaxed text-[#2d2320] outline-none placeholder:italic placeholder:text-[#5f5048]/65 focus:ring-0 sm:min-h-[150px] sm:px-5 sm:py-4 sm:text-xl"
	{value}
	{placeholder}
	{maxlength}
	oninput={(e) => {
		value = e.currentTarget.value;
	}}
></textarea>
