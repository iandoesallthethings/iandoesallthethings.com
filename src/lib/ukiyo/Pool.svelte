<script lang="ts">
	import type { FieldName, Project } from '$types'
	import Particle from '$ukiyo/Particle.svelte'
	import ProjectCard from '$components/ProjectCard.svelte'
	import { page } from '$app/state'
	import focus from '$lib/focus'
	import Blurb from '$components/Blurb.svelte'
	import localStore from '$lib/localStore'

	const gridMode = localStore('gridMode', false)

	const projects = $derived(page.data.projects)

	function toggleGrid() {
		$gridMode = !$gridMode
	}

	function shouldHide(project: Project, $focus: FieldName) {
		return !project.fields.includes($focus) && $focus !== 'all the things'
	}
</script>

<div
	class:h-full={!$gridMode}
	class="
			flex flex-wrap w-full max-h-full
			py-24 px-4
			items-center
			gap-2 sm:gap-4
			overflow-y-scroll
			no-scrollbar
			justify-between
		"
>
	<Blurb classes={$gridMode ? 'relative max-w-[220px]' : ''} />

	{#each projects as project (project.name)}
		<Particle disabled={$gridMode} hidden={shouldHide(project, $focus)}>
			<ProjectCard {project} />
		</Particle>
	{/each}

	{#each new Array(10), i (i)}
		<div class=""></div>
	{/each}
</div>

<button
	onclick={toggleGrid}
	title={$gridMode ? 'Switch to list mode' : 'Switch to Grid mode'}
	class="group rounded-full absolute bottom-2 right-2 text-white/80 drop-shadow-lg w-8 h-8 text-xl mix-blend-difference"
>
	<i
		class="
			group-hover:hidden
			fa solid
			{$gridMode ? 'fa-grid' : 'fa-water'}
		"
	></i>

	<i
		class="
			hidden group-hover:block
			fa solid
			{$gridMode ? 'fa-water' : 'fa-grid'}
	"
	></i>
</button>
