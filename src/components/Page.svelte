<script lang="ts">
	import { goto } from '$app/navigation'
	import { slide } from 'svelte/transition'

	function close() {
		goto('/')
	}
</script>

<div class="wrapper">
	<div on:click={close} class="overlay" />

	<article class="page" transition:slide>
		<slot />
	</article>
</div>

<style>
	.wrapper {
		@apply absolute top-0 left-0 w-full h-full flex items-center justify-center;
	}

	.overlay {
		@apply absolute top-0 left-0 w-full h-full flex justify-center items-center z-30 cursor-pointer;
	}

	.page {
		@apply bg-white bg-opacity-50 backdrop-blur-sm max-w-prose min-w-min max-h-screen overflow-y-scroll z-40 h-min rounded-2xl p-5 m-5 space-y-4 shadow-2xl;
	}
</style>
