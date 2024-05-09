<script lang="ts">
	import { page } from '$app/stores'
	import { fade } from 'svelte/transition'
	import focus from '$lib/focus'
	import floatToTop from '$ukiyo/floatToTop'
	import type { Field } from '$types'

	export let classes = ''

	$: currentBlurb = blurbFor($focus, $page.data.fields)

	async function blurbFor(focusedFieldName: string, fields: Field[]) {
		console.debug(fields)

		return (await fields).find((field) => field.name === focusedFieldName)?.blurb
	}

	let blurb: HTMLElement

	function float() {
		floatToTop(blurb, '.backdrop *')
	}
</script>

{#if currentBlurb}
	<div
		role="button"
		tabindex="0"
		on:keydown={float}
		bind:this={blurb}
		on:click={float}
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
