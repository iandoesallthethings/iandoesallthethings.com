<script lang="ts">
	import Particle from '$ukiyo/Particle.svelte'
	import ProjectCard from '$components/ProjectCard.svelte'
	import { page } from '$app/stores'

	import focus from '$lib/focus'

	const projects = $page.data.projects
</script>

<div class="w-full h-full relative">
	<div id="contrast">
		<div id="blur-pool" />
	</div>

	<div id="pool">
		{#each projects as project}
			{#if project.fields.includes($focus) || $focus === 'all the things'}
				<Particle>
					<ProjectCard {project} />
				</Particle>
			{/if}
		{/each}
	</div>
</div>

<style>
	#contrast {
		@apply absolute top-0 w-full h-full;
		@apply contrast-[50];
	}

	#blur-pool {
		@apply w-full h-full absolute top-0 left-0;
		@apply blur-[18px];
		@apply mix-blend-multiply;
	}

	#pool {
		@apply w-full h-full relative overflow-hidden select-none;
	}
</style>
