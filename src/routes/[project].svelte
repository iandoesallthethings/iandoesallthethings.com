<script context="module">
	import projects from '$lib/projects'
	export async function load({ params }) {
		const project = projects.find((project) => project.name === params.project)

		return { props: { project } }
	}
</script>

<script lang="ts">
	import Page from '$components/Page.svelte'

	export let project
</script>

<Page>
	<h1>{project.title}</h1>
	<p>
		A bunch of text goes here n junk. I'm too lazy to copy Lorem ipsum dolor sit amet, ad ullum
		nostro omittam usu, hinc assum error vis id. Mei in sint primis melius, vim eu tibique explicari
		consequat, no nec delenit scribentur.
	</p>
	{#if project.video}
		<video class="w-full" src={project.video} alt={project.title} autoplay muted loop playsInline />
	{:else}
		<img class="max-w-24" src={project.image || 'images/maybe.gif'} alt={project.title} />
	{/if}
	<p>
		Facer putent deserunt quo in, eu doctus fabulas disputationi pri, est lorem iisque nusquam cu.
		Bonorum expetenda an nec. Novum congue adolescens cu mel. In sea solet vulputate constituam.
	</p>

	<a href={project.link} target="_blank">See it here!</a>
</Page>
