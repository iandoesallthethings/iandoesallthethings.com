<script lang="ts">
	import { browser } from '$app/environment'
	import Page from '$components/Page.svelte'

	export let data
</script>

<Page>
	<header class="flex items-start justify-between space-x-10">
		<div>
			<h1>{@html data.project.name}</h1>
			<h3>{@html data.project.subtitle}</h3>
		</div>

		{#if data.project.link}
			<a href={data.project.link} target="_blank" class="px-3 py-2 rounded-md hover:bg-white/20">
				<i class="fas fa-external-link-alt" />
			</a>
		{/if}
	</header>

	{@html data.project.page}
</Page>
