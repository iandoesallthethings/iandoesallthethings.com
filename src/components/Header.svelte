<script lang="ts">
	import { fade } from 'svelte/transition'
	import focus from '$lib/focus'
	import { page } from '$app/stores'

	$: fields = $page.data.fields
	$: currentBlurb = blurbFor($focus)

	function blurbFor(focusedFieldName: string) {
		return fields.find((field) => field.name === focusedFieldName)?.blurb
	}
</script>

<header
	class="flex flex-col justify-between md:flex-row md:gap-4 w-full p-4 text-opacity-80 text-lg sm:text-xl"
>
	<div class="left min-w-fit">
		<h1 class="inline pr-2">ian edwards</h1>
		<span class="sm:hidden text-black/80">does</span>

		<nav class="flex gap-4 py-2">
			<span class="hidden sm:inline text-black/80">ian does</span>

			{#each fields as field}
				<label>
					<input
						type="radio"
						value={field.name}
						bind:group={$focus}
						on:click={() => ($focus = $focus)}
						class="hidden peer"
					/>
					<span
						class="whitespace-nowrap cursor-pointer text-white/80 peer-checked:font-bold peer-checked:drop-shadow-lg"
					>
						{field.name}
					</span>
				</label>
			{/each}
		</nav>
	</div>

	{#if currentBlurb}
		<div
			in:fade
			class="shrink flex items-end blurb text-base text-justify drop-shadow-md max-w-prose"
		>
			{@html currentBlurb}
		</div>
	{/if}
</header>
