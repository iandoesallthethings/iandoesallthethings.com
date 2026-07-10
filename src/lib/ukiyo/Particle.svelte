<script lang="ts">
	import type { Snippet } from 'svelte'
	import { fade } from 'svelte/transition'
	import floatToTop from '$ukiyo/floatToTop'
	import ukiyo from '$ukiyo'

	interface Props {
		hidden?: boolean
		disabled?: boolean
		children: Snippet
	}

	let { hidden = false, disabled = false, children }: Props = $props()

	let particle: HTMLElement | undefined = $state()

	function randomFadeTime() {
		return Math.random() * 800
	}
</script>

{#if hidden}
	<!--  -->
{:else if disabled}
	{@render children()}
{:else}
	<!-- svelte-ignore a11y_no_static_element_interactions -- the interactive element is the project link inside; this wrapper only floats it -->
	<div
		use:ukiyo
		bind:this={particle}
		onpointerdown={() => particle && floatToTop(particle, '.backdrop *')}
		class="particle cursor-pointer touch-none"
		in:fade={{ duration: randomFadeTime() }}
		out:fade={{ duration: 375 }}
	>
		{@render children()}
	</div>
{/if}
