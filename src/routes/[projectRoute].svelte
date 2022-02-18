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
	import type { Project } from '$lib/types'

	export let db
	export let projectRoute

	$localDb = db

	let project: Project = {}

	onMount(() => {
		project = $localDb.projects.find((p) => p.route === projectRoute)
	})
</script>

<Page>
	{#if project}
		<h1>{project?.name}</h1>

		{@html project.page ? parsePage(project?.page) : ''}

		{#if project.link}
			<a href={project.link} target="_blank">Link</a>
		{/if}
	{:else}
		<h1>404'd!</h1>

		<img src="images/404d.png" alt="404'd!" class="rounded-lg my-2" />
	{/if}
</Page>
