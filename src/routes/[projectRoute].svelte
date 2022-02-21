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

		const res = await fetch(`/api.json`)
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
	import type { Project } from '$lib/types'
	import Page from '$components/Page.svelte'
	import localDb from '$lib/localDb'

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
		<header class="flex flex-row items-start justify-between space-x-10 mb-5">
			<h1>{@html project.name}</h1>

			{#if project.link}
				<a href={project.link} target="_blank" class="px-3 py-2 rounded-md hover:bg-white/20">
					<i class="fas fa-external-link-alt" />
				</a>
			{/if}
		</header>

		{@html project.page}
	{:else}
		<h1>404'd!</h1>

		<img src="images/404d.png" alt="404'd!" class="rounded-lg my-2" />
	{/if}
</Page>
