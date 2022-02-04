<script lang="ts">
	import { focus } from '$lib/stores'
	import { fade, fly } from 'svelte/transition'
	import localDb from '$lib/localDb'
	import { onMount } from 'svelte'
	import { parseRichText } from '$lib/notionUtils'

	let fields = []
	onMount(() => (fields = $localDb.fields))

	function blurbFor(focusedField) {
		return parseRichText(fields.find((f) => f.name === focusedField).blurb)
	}
</script>

<header>
	<div>
		<h1>ian edwards</h1>
		<nav>
			<span class="text-gray-700">ian does</span>
			{#each fields as field}
				<label>
					<input
						type="radio"
						value={field.name}
						bind:group={$focus}
						on:click={() => ($focus = $focus)}
						class="hidden"
					/>
					<span> {field.name} </span>
				</label>
			{/each}
		</nav>
	</div>

	<div class="w-full flex justify-center items-center mx-10 flex-col items-center">
		{#key $focus}
			{#if fields.find((field) => field.name === $focus)?.blurb}
				<div class="blurb" in:fly={{ y: -50, duration: 500 }}>
					{@html blurbFor($focus)}
				</div>
			{/if}
		{/key}
	</div>
</header>

<style>
	header {
		@apply w-full p-2 space-y-2 mt-2 mx-5 flex flex-row flex-wrap lg:flex-nowrap items-start;
	}

	nav {
		@apply flex my-4 justify-between w-full min-w-fit text-base md:text-xl space-x-2 md:space-x-4 whitespace-nowrap;
	}

	.blurb {
		@apply flex justify-center text-center rounded-xl shadow-md bg-sky-400 bg-opacity-50 p-5 max-w-prose;
	}

	input + span {
		@apply cursor-pointer text-white px-2 py-1 text-base md:text-xl;
	}
	input:hover + span {
		@apply bg-white bg-opacity-10 rounded-md shadow-sm;
	}
	input:checked + span {
		@apply font-bold drop-shadow-md;
	}
</style>
