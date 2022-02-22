<script>
	import '../app.css'
	import 'highlight.js/styles/github.css'

	import { darkMode, focus } from '$lib/stores'
	import Header from '$components/Header.svelte'
	import Pool from '$components/Pool.svelte'
	import Konami from '$components/Konami.svelte'
	import Footer from '$components/Footer.svelte'
	// import Obi from '$components/Obi.svelte'
</script>

<!-- <main class={$darkMode ? 'dark' : ''}> -->
<theme class:dark={$darkMode}>
	<main>
		<Header />

		<Pool />

		<slot />

		<Footer />

		<Konami />
	</main>
</theme>

<style>
	main {
		@apply absolute top-0 left-0 w-full h-full flex flex-col bg-sky-500 dark:bg-sky-600 overflow-hidden;
	}
</style>
