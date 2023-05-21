<script>
	import IconXL from './IconXL.svelte';
</script>

<div
	role="status"
	class="relative flex flex-col md:flex-row bg-neutral-800/70 shadow-md p-6 animate-pulse space-y-0 md:space-x-8 items-center "
>
	<div class="hidden md:block h-[250px] w-2/5 flex-none bg-gray-300 bg-center">
		<div class="w-full h-full items-center flex justify-center">
            <IconXL/>
		</div>
	</div>
	<!--  -->
	<div
		class="md:hidden z-10 absolute inset-0 bg-cover bg-center">
        <div class="w-full h-full items-center flex justify-center">
		</div>
    </div>

    <div class="w-full md:hidden">
		<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-16 mb-4" />
		<div class="h-7" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-24 mb-2.5" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5" />
		<div class="h-7" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2.5" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-32" />
	</div>

	<div class="w-full md:block hidden">
		<div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4" />
		<div class="h-7" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2.5" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-52 mb-2.5" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2.5" />
		<div class="h-7" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-2.5" />
		<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-48" />
	</div>
	<span class="sr-only">Loading...</span>
</div>
