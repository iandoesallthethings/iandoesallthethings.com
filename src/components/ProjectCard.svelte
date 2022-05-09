<script>
	import { goto } from '$app/navigation'

	export let project

	function open() {
		goto(`/${project.route}`)
	}
</script>

<a href="/{project.route}" sveltekit:prefetch draggable="false">
	{#if project.video}
		<video
			class="w-full"
			src={project.video}
			alt={project.name}
			disableRemotePlayback="true"
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

<style>
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
