<script lang="ts">
	import { page } from '$app/stores'
	import { fade } from 'svelte/transition'
	import focus from '$lib/focus'
	import floatToTop from '$ukiyo/floatToTop'

	export let classes = ''

	async function blurbFor(focusedFieldName: string) {
		const fields = await $page.data.fields
		return fields.find((field) => field.name === focusedFieldName)?.blurb ?? ''
	}

	let blurbContainer: HTMLElement

	function float() {
		floatToTop(blurbContainer, '.backdrop *')
	}
</script>

{#await blurbFor($focus) then blurb}
	<div
		role="button"
		tabindex="0"
		on:keydown={float}
		bind:this={blurbContainer}
		on:click={float}
		in:fade
		class="
				absolute z-0
				w-full h-full shrink
				flex flex-col justify-center items-center
				text-justify
				pointer-events-none
				{classes}
			"
	>
		<div class="max-w-xs p-2 backdrop-blur-sm rounded-2xl drop-shadow-md">
			<h2 class="pointer-events-auto w-min">Hi.</h2>

			<p class="pointer-events-auto">
				{@html blurb}
			</p>
		</div>
	</div>
{/await}
