<script lang="ts">
	import Particle from '$components/Particle.svelte'
	import { focus } from '$lib/stores'

	export let particles
</script>

<figure>
	{#each particles as particle}
		{#if particle.field === $focus || $focus === 'all the things'}
			<Particle {particle} />
		{/if}
	{/each}

	<!-- <div class="divider" /> -->
</figure>

<style>
	figure {
		@apply bg-sky-500 dark:bg-sky-900 w-full h-full relative overflow-hidden;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-o-user-select: none;
		user-select: none;
	}

	.divider {
		@apply absolute border border-black w-full;
		top: 400px;
	}
</style>
