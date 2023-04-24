<script lang="ts">
	import Page from '$components/Page.svelte'

	export let data

	$: project = data.project
</script>

<Page>
	<header class="flex flex-row items-start justify-between space-x-10 mb-5">
		<div class="">
			<h1>{@html project.name}</h1>
			<h3>{@html project.subtitle}</h3>
		</div>

		{#if project.link}
			<a href={project.link} target="_blank" class="px-3 py-2 rounded-md hover:bg-white/20">
				<i class="fas fa-external-link-alt" />
			</a>
		{/if}
	</header>

	{@html project.page}
</Page>
