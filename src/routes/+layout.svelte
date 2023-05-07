<script lang="ts">
	import '../app.css'
	import 'highlight.js/styles/github.css'
	import { page } from '$app/stores'
	import * as Analytics from '$lib/Analytics'
	import Header from '$components/Header.svelte'
	import Konami from '$components/Konami.svelte'
	import Footer from '$components/Footer.svelte'
	import Pool from '$ukiyo/Pool.svelte'
	import focus from '$lib/focus'

	export let data
	$focus = data.fields[0]

	$: projects = data.projects
	$: fields = data.fields
	const updateAnalytics = Analytics.initialize()

	$: updateAnalytics($page)
</script>

<main>
	<Header {fields} />

	<Pool {projects} />

	<slot />

	<Footer />

	<Konami />
</main>

<style lang="postcss">
	main {
		@apply w-[100dvw] h-[100dvh] overflow-hidden;
		@apply flex flex-col;
	}

	:global(body) {
		@apply bg-sky-500 dark:bg-sky-600;
	}
</style>
