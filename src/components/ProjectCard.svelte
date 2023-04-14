<script>
	// For some reason ts breaks syntax highlighting here??
	// import type { Project } from '$types'
	// export let project: Project
	/** @type {import('$types').Project} */
	export let project
</script>

<a href="/{project.route}" data-sveltekit-preload-data draggable="false" class="group">
	{#if project.video}
		<video
			class="w-full"
			src={project.video}
			disableRemotePlayback={true}
			autoplay
			muted
			loop
			playsInline
		/>
	{:else}
		<img src={project.image || 'images/maybe.gif'} alt={project.name} />
	{/if}

	<div class="text-white text-sm">
		{@html project.name}
	</div>
</a>

<style lang="postcss">
	a {
		@apply bg-gray-900 w-48 max-h-fit flex flex-col items-center text-center rounded-lg shadow-xl overflow-hidden transition;
	}

	img {
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}
</style>
