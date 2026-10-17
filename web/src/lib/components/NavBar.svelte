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
	class="sticky top-0 z-20 -mx-5 mb-8 border-b border-amber-100/10 bg-[#100b11]/90 px-5 backdrop-blur-xl sm:-mx-8 sm:mb-10 sm:px-8 xl:bg-transparent xl:backdrop-blur-none"
>
	<div class="mx-auto max-w-[92rem] py-3.5">
		<div class="flex items-center justify-between">
			<a href="/" class="group flex items-center gap-2.5 text-white">
				<span class="text-amber-300 transition group-hover:text-amber-200"><Icon /></span>
				<span class="display-type text-2xl font-bold italic tracking-normal sm:text-3xl"
					>cinemattr</span
				>
			</a>
			<div class="flex items-center gap-1">
				{#each links as link}
					<a
						href={link.href}
						aria-current={page.url.pathname === link.href ? 'page' : undefined}
						class={`nav-tape px-3 py-2 font-mono text-xs font-bold uppercase tracking-[0.12em] transition sm:px-4 ${link.href === '/' ? 'hidden sm:block' : ''} ${page.url.pathname === link.href ? '-rotate-1 bg-[#d8c7a7] text-neutral-950' : 'text-white/55 hover:bg-white/[0.06] hover:text-amber-200 xl:bg-[#d8c7a7]/85 xl:text-[#241812] xl:hover:bg-[#eadbbf]'}`}
						>{link.label}</a
					>
				{/each}
			</div>
		</div>
	</div>
</nav>
