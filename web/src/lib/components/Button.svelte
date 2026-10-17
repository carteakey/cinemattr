<script>
	/** @type {{ variant?: 'primary' | 'secondary', ticketCode?: string, disabled?: boolean, type?: 'button' | 'submit', onclick?: (e: MouseEvent) => void, children: import('svelte').Snippet }} */
	let {
		variant = 'primary',
		ticketCode,
		disabled = false,
		type = 'button',
		onclick,
		children
	} = $props();

	const base =
		'display-type ticket-cut inline-flex min-h-11 min-w-[10.25rem] flex-1 items-center justify-center gap-2 whitespace-nowrap border px-5 py-2 text-base font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none';

	const variants = {
		primary:
			'border-[#6b321e] bg-[#d89426] text-[#21160f] shadow-[3px_3px_0_#713144] hover:-translate-y-0.5 hover:bg-amber-300 focus-visible:ring-amber-300',
		secondary:
			'border-[#5c4236] bg-[#f0e4c9] text-[#30231e] shadow-[3px_3px_0_#49303e] hover:-translate-y-0.5 hover:bg-white focus-visible:ring-white/40'
	};

	let classes = $derived(
		`${base} ${ticketCode ? 'action-ticket' : ''} ${variants[variant] ?? variants.primary}`
	);
</script>

<button {type} {disabled} {onclick} class={classes} data-ticket-code={ticketCode}>
	{@render children()}
</button>
