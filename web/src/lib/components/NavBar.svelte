<script>
	import Icon from './Icon.svelte';
	import { page } from '$app/state';

	const links = [
		{ href: '/', label: 'Search' },
		{ href: '/discover', label: 'Discover' },
		{ href: '/faq', label: 'FAQ' }
	];
</script>

<nav
	class="sticky top-0 z-20 -mx-5 mb-8 border-b border-amber-100/10 bg-[#100b11]/90 px-5 backdrop-blur-xl sm:-mx-8 sm:mb-10 sm:px-8"
>
	<div class="mx-auto max-w-5xl py-3.5">
		<div class="flex items-center justify-between">
			<a href="/" class="group flex items-center gap-2.5 text-white">
				<span class="text-amber-300 transition group-hover:text-amber-200"><Icon /></span>
				<span class="display-type text-xl font-bold italic tracking-[-0.04em]">cinemattr</span>
			</a>
			<div class="flex items-center gap-1">
				{#each links as link}
					<a
						href={link.href}
						aria-current={page.url.pathname === link.href ? 'page' : undefined}
						class={`ticket-cut px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] transition sm:px-4 ${link.href === '/' ? 'hidden sm:block' : ''} ${page.url.pathname === link.href ? '-rotate-1 bg-amber-300 text-neutral-950' : 'text-white/55 hover:bg-white/[0.06] hover:text-amber-200'}`}
						>{link.label}</a
					>
				{/each}
			</div>
		</div>
	</div>
</nav>
