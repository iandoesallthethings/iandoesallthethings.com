<script lang="ts">
	import { page } from '$app/stores'
	import { fade } from 'svelte/transition'
	import focus from '$lib/focus'
	import floatToTop from '$ukiyo/floatToTop'

	export let classes = ''

	$: fields = $page.data.fields
	$: currentBlurb = blurbFor($focus)

	function blurbFor(focusedFieldName: string) {
		return fields.find((field) => field.name === focusedFieldName)?.blurb
	}

	let blurb: HTMLElement

	function float() {
		floatToTop(blurb, '.backdrop *')
	}
</script>

{#if currentBlurb}
	<div
		bind:this={blurb}
		in:fade
		on:click={float}
		on:keydown
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
