<script lang="ts">
	import type { Project } from '$types'

	export let project: Project

	$: altText = `${stripHtml(project.name)}: ${stripHtml(project.subtitle)}`
	function stripHtml(s: string) {
		return s?.replace(/<[^>]*>?/gm, '') ?? ''
	}
</script>

<a href="/{project.route}" data-sveltekit-preload-data draggable="false" class="group">
	{#if project.video}
		<video
			title={altText}
			class="w-full"
			src={project.video}
			disableRemotePlayback={true}
			autoplay
			muted
			loop
			playsInline
		/>
	{:else}
		<img src={project.image || 'images/maybe.gif'} alt={altText} />
	{/if}

	<div class="text-white/90 font-bold text-sm">
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
