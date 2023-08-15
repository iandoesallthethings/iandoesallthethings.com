<script lang="ts">
	import { fade } from 'svelte/transition'
	import floatToTop from '$ukiyo/floatToTop'
	import ukiyo from '$ukiyo'

	export let hidden = false
	export let disabled = false

	let particle: HTMLElement

	function randomFadeTime() {
		return Math.random() * 800
	}
</script>

{#if hidden}
	<!--  -->
{:else if disabled}
	<slot />
{:else}
	<div
		use:ukiyo
		bind:this={particle}
		on:pointerdown={() => floatToTop(particle, '.backdrop *')}
		class="particle cursor-pointer touch-none"
		in:fade={{ duration: randomFadeTime() }}
		out:fade={{ duration: 375 }}
	>
		<slot />
	</div>
{/if}
