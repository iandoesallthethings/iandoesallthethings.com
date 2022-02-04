<script context="module">
	import { browser } from '$app/env'
	import { get } from 'svelte/store'
	import dbStore from '$lib/localDb'

	export async function load({ fetch, params }) {
		if (browser) {
			const cachedDb = get(dbStore)
			if (cachedDb)
				return {
					props: {
						db: cachedDb,
						projectRoute: params.projectRoute
					}
				}
		}

		const res = await fetch(`/notion.json`)
		const db = await res.json()

		return {
			props: {
				db,
				projectRoute: params.projectRoute
			}
		}
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import Page from '$components/Page.svelte'
	import localDb from '$lib/localDb'
	import { parsePage } from '$lib/notionUtils'

	export let db
	export let projectRoute

	$localDb = db

	$: project = {}

	onMount(() => {
		project = $localDb.projects.find((p) => p.route === projectRoute)
	})
</script>

<Page>
	<h1>{project?.name}</h1>

	{@html project.page ? parsePage(project?.page) : ''}

	{#if project.link}
		<a href={project.link} target="_blank">Link</a>
	{/if}
</Page>
