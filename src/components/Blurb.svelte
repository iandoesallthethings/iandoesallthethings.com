<script lang="ts">
	import type { Field } from '$types'
	import { page } from '$app/state'
	import { fade } from 'svelte/transition'
	import focus from '$lib/focus'
	import floatToTop from '$ukiyo/floatToTop'

	let { classes = '' }: { classes?: string } = $props()

	const currentBlurb = $derived(
		page.data.fields.find((field: Field) => field.name === $focus)?.blurb
	)

	let blurb: HTMLElement | undefined = $state()

	function float() {
		if (blurb) floatToTop(blurb, '.backdrop *')
	}
</script>

{#if currentBlurb}
	<div
		role="button"
		tabindex="0"
		onkeydown={float}
		bind:this={blurb}
		onclick={float}
		in:fade
		class="
				absolute
				z-0
				w-full h-full
				shrink
				flex flex-col justify-center items-center
				text-justify
				pointer-events-none
				{classes}
			"
	>
		<div
			class="
				max-w-xs p-2
				backdrop-blur-sm rounded-2xl
				drop-shadow-md
			"
		>
			<h2 class="pointer-events-auto w-min">Hi.</h2>

			<p class="pointer-events-auto">
				{@html currentBlurb}
			</p>
		</div>
	</div>
{/if}
