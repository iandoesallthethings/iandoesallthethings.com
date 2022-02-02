<script>
	import { goto } from '$app/navigation'

	export let project

	function open() {
		console.log('clicked')
		goto(`/${project.name}`)
	}
</script>

<article on:click={open}>
	{#if project.video}
		<video class="w-full" src={project.video} alt={project.title} autoplay muted loop playsInline />
	{:else}
		<img src={project.image || 'images/maybe.gif'} alt={project.title} />
	{/if}
	<div class="text-white">{project.title}</div>
</article>

<style>
	img {
		-webkit-user-drag: none;
		-khtml-user-drag: none;
		-moz-user-drag: none;
		-o-user-drag: none;
		user-drag: none;
	}
</style>
