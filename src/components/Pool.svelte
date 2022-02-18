<script lang="ts">
	import { onMount } from 'svelte'
	import Particle from '$components/Particle.svelte'
	import ProjectCard from './ProjectCard.svelte'
	import type { Project } from '$lib/types'

	import { focus } from '$lib/stores'
	import localDb from '$lib/localDb'

	let projects: Project[] = []
	onMount(() => {
		projects = $localDb.projects
	})
</script>

<figure>
	{#each projects as project}
		{#if project.fields.includes($focus) || $focus === 'all the things'}
			<Particle>
				<ProjectCard {project} />
			</Particle>
		{/if}
	{/each}
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
</style>
