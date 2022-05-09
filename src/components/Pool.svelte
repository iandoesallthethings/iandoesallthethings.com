<script lang="ts">
	import Particle from '$components/Particle.svelte'
	import ProjectCard from './ProjectCard.svelte'
	import type { Field, Project } from '$lib/types'

	import { focus } from '$lib/stores'

	export let projects: Project[] = []
</script>

<div id="pool">
	{#each projects as project}
		{#if project.fields.includes($focus) || $focus === 'all the things'}
			<Particle>
				<ProjectCard {project} />
			</Particle>
		{/if}
	{/each}
</div>

<style>
	#pool {
		@apply w-full h-full relative overflow-hidden select-none;
	}
</style>
