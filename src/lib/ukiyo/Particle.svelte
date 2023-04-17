<script lang="ts">
	import { fade } from 'svelte/transition'
	import floatToTop from '$ukiyo/floatToTop'
	import ukiyo from '$ukiyo'
	import portal from './portal'

	let particle: HTMLElement

	function randomFadeTime() {
		return Math.random() * 800
	}

	function updatePosition(event: CustomEvent) {
		top = event.detail.y
		left = event.detail.x
	}

	$: top = 0
	$: left = 0
</script>

<div
	class="particle"
	bind:this={particle}
	use:ukiyo
	in:fade={{ duration: randomFadeTime() }}
	out:fade={{ duration: 375 }}
	on:pointerdown={() => floatToTop(particle)}
	on:particle-move={updatePosition}
>
	<div
		use:portal={'#blur-pool'}
		class="metaball"
		style="position:absolute; left: {left}px; top: {top}px;"
	>
		<slot />

		<div
			class="
			window bg-white
			w-[50%] h-50%
			left-1/2 -translate-x-1/2
			top-1/2 -translate-y-1/2
			absolute
		"
		/>
	</div>

	<div class="fade">
		<slot />
	</div>
</div>

<style>
	.particle {
		@apply absolute cursor-pointer touch-none;
		/* @apply mix-blend-multiply; */
	}

	.metaball {
		@apply absolute;
		@apply scale-110;
	}
</style>
