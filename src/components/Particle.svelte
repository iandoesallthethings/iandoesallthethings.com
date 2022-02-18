<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { fade, fly, slide } from 'svelte/transition'
	import floatToTop from '$lib/floatToTop'
	import float from '$lib/float'
	const dispatch = createEventDispatcher()

	let particle
</script>

<div
	use:float
	bind:this={particle}
	on:click={() => floatToTop(particle)}
	class="particle"
	transition:fade
>
	<slot />
</div>

<style>
	.particle {
		@apply absolute cursor-pointer;
		touch-action: none;
	}
</style>
