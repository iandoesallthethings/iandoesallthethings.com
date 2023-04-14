<script lang="ts">
	import { fade } from 'svelte/transition'
	import floatToTop from '$ukiyo/floatToTop'
	import ukiyo from '$ukiyo'

	let particle: HTMLElement

	function randomFadeTime() {
		return Math.random() * 800
	}
</script>

<div
	use:ukiyo
	bind:this={particle}
	on:pointerdown={() => floatToTop(particle)}
	class="particle"
	in:fade={{ duration: randomFadeTime() }}
	out:fade={{ duration: 375 }}
>
	<slot />
</div>

<style>
	.particle {
		@apply absolute cursor-pointer;
		touch-action: none;
	}
</style>
