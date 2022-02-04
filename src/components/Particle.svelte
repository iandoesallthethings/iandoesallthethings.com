<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade, fly, slide } from 'svelte/transition'
	import float from '$lib/float'

	const dispatch = createEventDispatcher()
</script>

<div use:float on:dragstart={() => dispatch('dragstart')} class="particle" transition:fade>
	<slot />
</div>

<style>
	.particle {
		@apply absolute z-10 cursor-pointer;
		touch-action: none;
	}
</style>
