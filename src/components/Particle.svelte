<script lang="ts">
	import { fade, fly, slide } from 'svelte/transition'
	import float from '$lib/float'
</script>

<div use:float class="particle" transition:fade>
	<slot />
</div>

<style>
	.particle {
		@apply absolute z-10 cursor-pointer;
		touch-action: none;
	}
</style>
