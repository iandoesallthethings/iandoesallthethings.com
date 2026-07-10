<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fade } from 'svelte/transition'
	import clickOutside from '$lib/clickOutside'
	import { goto } from '$app/navigation'

	let { children }: { children: Snippet } = $props()

	function close() {
		goto('/')
	}
</script>

<div class="wrapper">
	<article use:clickOutside={close} transition:fade class="page">
		{@render children()}
	</article>
</div>

<style lang="postcss">
	.wrapper {
		@apply cursor-pointer;
		@apply backdrop-blur-sm transition;
		@apply absolute top-0 left-0 w-full h-full flex items-center justify-center py-16;
	}

	.page {
		@apply z-40 cursor-default rounded-2xl bg-white/50 backdrop-blur-2xl;
		@apply m-4 w-full md:max-w-prose h-full max-h-full;
		@apply p-5 shadow-2xl overflow-y-scroll;
	}
</style>
