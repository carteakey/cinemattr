<script>
	/** @type {'primary' | 'secondary'} */
	export let variant = 'primary';
	export let disabled = false;
	/** @type {'button' | 'submit'} */
	export let type = 'button';

	const base =
		'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 disabled:opacity-60 disabled:cursor-not-allowed';

	const variants = {
		primary:
			'border-red-500/40 bg-red-700/80 hover:bg-red-600/90 text-white shadow-sm shadow-red-900/40 focus-visible:ring-red-400',
		secondary:
			'border-white/20 bg-neutral-800/70 hover:bg-neutral-700/70 text-white/90 focus-visible:ring-white/40'
	};

	$: classes = `${base} ${variants[variant] ?? variants.primary}`;
</script>

<button {type} {disabled} on:click class={classes}>
	<slot />
</button>
