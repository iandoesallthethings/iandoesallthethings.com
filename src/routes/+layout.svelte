<script lang="ts">
	import '../app.css'
	import 'highlight.js/styles/github.css'

	import Header from '$components/Header.svelte'
	import Pool from '$ukiyo/Pool.svelte'
	import Konami from '$components/Konami.svelte'
	import Footer from '$components/Footer.svelte'
</script>

<theme>
	<main
		class="
			absolute top-0 left-0
			w-full h-full
			flex flex-col
			bg-sky-500 dark:bg-sky-600
			overflow-hidden
		"
	>
		<Header />

		<Pool />

		<slot />

		<Footer />

		<Konami />
	</main>
</theme>
