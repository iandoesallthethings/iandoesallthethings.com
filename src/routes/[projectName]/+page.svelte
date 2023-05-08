<script lang="ts">
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import Page from '$components/Page.svelte'

	export let data

	$: project = data.project

	function goHome() {
		goto('/')
	}
</script>

<Page on:close={goHome}>
	<header class="flex items-start justify-between space-x-10">
		<div>
			<h1>{@html project.name}</h1>
			<h3>{@html project.subtitle}</h3>
		</div>

		{#if project.link}
			<a href={project.link} target="_blank" class="px-3 py-2 rounded-md hover:bg-white/20">
				<i class="fas fa-external-link-alt" />
			</a>
		{/if}
	</header>

	<!-- Alas, youtube embeds break ssr -->
	{#if browser}
		{@html project.page}
	{/if}
</Page>
