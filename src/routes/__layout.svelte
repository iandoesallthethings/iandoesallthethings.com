<script context="module" lang="ts">
	export async function load({ fetch }) {
		const response = await fetch('/api/fields.json')
		const fields: Field[] = await response.json()
		return {
			props: { fields }
		}
	}
</script>

<script lang="ts">
	import '../app.css'
	import 'highlight.js/styles/github.css'
	import type { Field, Project } from '$lib/types'
	import { darkMode } from '$lib/stores'
	import { onMount } from 'svelte'
	// import { cache } from '$lib/cachedFetch'

	import Header from '$components/Header.svelte'
	import Pool from '$components/Pool.svelte'
	import Konami from '$components/Konami.svelte'
	import Footer from '$components/Footer.svelte'
	// import Obi from '$components/Obi.svelte'

	export let fields: Field[] = []

	let projects: Project[] = []

	onMount(async () => {
		const response = await fetch('/api/projects.json')
		projects = await response.json()
	})

	// $: console.debug('cache', $cache)
</script>

<theme class:dark={$darkMode}>
	<main>
		<Header {fields} />

		<Pool {projects} />

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
