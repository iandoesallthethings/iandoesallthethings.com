<script lang="ts">
	import Particle from '$ukiyo/Particle.svelte'
	import ProjectCard from '$components/ProjectCard.svelte'
	import { page } from '$app/stores'
	import focus from '$lib/focus'

	$: projects = $page.data.projects
</script>

{#each projects as project}
	{#if project.fields.includes($focus) || $focus === 'all the things'}
		<Particle>
			<ProjectCard {project} />
		</Particle>
	{/if}
{/each}
