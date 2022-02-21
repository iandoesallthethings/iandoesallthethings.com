<script lang="ts">
	import { goto } from '$app/navigation'
	import { slide } from 'svelte/transition'
	import clickOutside from '$lib/clickOutside'
	import { onMount } from 'svelte'
	import floatToTop from '$lib/floatToTop'

	function close() {
		goto('/')
	}

	let page

	onMount(() => floatToTop(page))
</script>

<!-- <div class="overlay" /> -->
<div bind:this={page} class="wrapper">
	<article use:clickOutside on:outclick={close} transition:slide class="page">
		<slot />
	</article>
</div>

<style>
	/* .overlay {
		@apply absolute top-0 left-0 w-full h-full flex justify-center items-center z-30 cursor-pointer;
	} */

	.wrapper {
		@apply absolute top-0 left-0 w-full h-full flex items-center justify-center py-32;
	}

	.page {
		@apply bg-white bg-opacity-50 backdrop-blur-md max-w-sm md:max-w-prose max-h-full overflow-y-scroll z-40 rounded-2xl p-5 space-y-4 shadow-2xl overflow-y-scroll;
	}
</style>
