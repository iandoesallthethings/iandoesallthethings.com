<script context="module" lang="ts">
	import cachedFetch from '$lib/cachedFetch'

	/** @type {import('./[projectRoute]').Load} */
	export async function load({ fetch, params }) {
		const route = params.projectRoute

		return await cachedFetch(fetch, route)
	}
</script>

<script lang="ts">
	import type { Project } from '$lib/types'
	import Page from '$components/Page.svelte'

	export let project: Project
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
