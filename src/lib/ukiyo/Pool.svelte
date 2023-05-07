<script lang="ts">
	import type { ProjectWithFields } from '$types'
	import Particle from '$ukiyo/Particle.svelte'
	import ProjectCard from '$components/ProjectCard.svelte'
	import focus from '$lib/focus'

	export let projects: ProjectWithFields[]
</script>

<div id="pool">
	{#each projects as project}
		{#if project.fields.map((f) => f.id)?.includes($focus.id) || $focus.id === 'all the things'}
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
