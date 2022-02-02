<script>
	import '../app.css'
	import { darkMode } from '$lib/stores'

	import Header from '$components/Header.svelte'
	import Pool from '$components/Pool.svelte'

	import projects from '$lib/projects'
</script>

<main class={$darkMode ? 'dark' : ''}>
	<Header />

	<Pool particles={projects} />

	<slot />
</main>

<style>
	main {
		@apply absolute top-0 left-0 w-full h-full;
	}
</style>
