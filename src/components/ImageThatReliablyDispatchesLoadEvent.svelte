<script lang="ts">
	// If an image is loaded before we attach the load listener, we'll never see a load event.
	// This component solves that problem.
	import { onMount, createEventDispatcher } from 'svelte'
	import observe from '$lib/observe'

	const dispatch = createEventDispatcher()

	export let element: HTMLImageElement | null = null
	export let src: string
	export let alt: string
	export let classes = ''
	export let style = ''

	let loadEventFired = false

	// If the src changes, allow another load event to be dispatched.
	$: {
		observe(src)
		loadEventFired = false
	}

	onMount(() => {
		if (element == null) {
			throw new Error(`Image element didn't mount.`)
		}

		if (element.complete) {
			dispatchLoad()
		}
	})

	function dispatchLoad() {
		if (loadEventFired) {
			return
		}

		if (element == null) {
			throw new Error(`Image element didn't mount.`)
		}

		loadEventFired = true

		dispatch('load', element)
	}
</script>

<img on:load={dispatchLoad} bind:this={element} {src} {alt} class={classes} {style} />
