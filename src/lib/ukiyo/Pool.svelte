<script lang="ts">
	import Particle from '$ukiyo/Particle.svelte'
	import ProjectCard from '$components/ProjectCard.svelte'
	import { page } from '$app/stores'
	import focus from '$lib/focus'
	import Blurb from '$components/Blurb.svelte'
	import localStore from '$lib/localStore'

	const gridMode = localStore('gridMode', false)

	$: projects = $page.data.projects

	function toggleGrid() {
		$gridMode = !$gridMode
	}
</script>

{#if $gridMode}
	<div
		class="
			flex flex-wrap w-full max-h-full
			py-24 px-4
			items-center
			gap-2 sm:gap-4
			overflow-scroll
			justify-between
		"
	>
		<Blurb classes="relative max-w-[220px]" />

		{#each projects as project}
			{#if project.fields.includes($focus) || $focus === 'all the things'}
				<ProjectCard {project} />
			{/if}
		{/each}

		{#each new Array(10) as pad}
			<div class="" />
		{/each}
	</div>
{:else}
	<Blurb />

	{#each projects as project}
		{#if project.fields.includes($focus) || $focus === 'all the things'}
			<Particle>
				<ProjectCard {project} />
			</Particle>
		{/if}
	{/each}
{/if}

<button
	on:click={toggleGrid}
	title={$gridMode ? 'Switch to list mode' : 'Switch to Grid mode'}
	class="group rounded-full absolute bottom-2 right-2 text-white/80 drop-shadow-lg w-8 h-8 text-xl mix-blend-difference"
>
	<i
		class="
			group-hover:hidden
			fa solid
			{$gridMode ? 'fa-grid' : 'fa-water'}
		"
	/>

	<i
		class="
			hidden group-hover:block
			fa solid
			{$gridMode ? 'fa-water' : 'fa-grid'}
	"
	/>
</button>
