<script>
	import '../app.css'
	import { darkMode, focus } from '$lib/stores'

	import Header from '$components/Header.svelte'
	import Pool from '$components/Pool.svelte'
	import Konami from '$components/Konami.svelte'

	import projects from '$lib/projects'
	import Footer from '$components/Footer.svelte'
	import Obi from '$components/Obi.svelte'
</script>

<main class={$darkMode ? 'dark' : ''}>
	<Header />

	<Pool />

	<slot />

	<Footer />

	<Konami />
</main>

<style>
	main {
		@apply absolute top-0 left-0 w-full h-full flex flex-col bg-sky-500 overflow-hidden;
	}
</style>
