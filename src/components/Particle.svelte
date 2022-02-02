<script lang="ts">
	import ProjectCard from '$components/ProjectCard.svelte'

	import float from '$lib/float'

	export let particle
</script>

<div use:float class="particle">
	<ProjectCard project={particle} />
</div>

<style>
	.particle {
		@apply absolute z-10 cursor-pointer bg-gray-900 w-40 max-h-fit flex flex-col items-center text-center rounded-lg shadow-xl overflow-hidden;
	}
</style>
