<script lang="ts">
	import Particle from '$ukiyo/Particle.svelte'
	import ProjectCard from '$components/ProjectCard.svelte'
	import { page } from '$app/stores'

	import { focus } from '$lib/stores'

	$: projects = $page.data.projects
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
