<script lang="ts">
	import { fly } from 'svelte/transition'
	import focus from '$lib/focus'
	import type { Field } from '@prisma/client'

	export let fields: Field[]

	function setFocus(field: Field) {
		$focus = field
	}
	function blurbFor(currentField: Field) {
		return fields.find((field) => field.id === currentField.id)?.blurb
	}

	console.debug(fields)
</script>

<header>
	<div>
		<h1>ian edwards</h1>
		<nav>
			<span class="text-black/80">ian does</span>
			{#each fields as field}
				<label>
					<input
						type="radio"
						value={field}
						bind:group={$focus}
						on:click={() => setFocus(field)}
						class="hidden"
					/>
					<span>{field.name}</span>
				</label>
			{/each}
		</nav>
	</div>

	<div class="w-full flex justify-center items-center mx-10 flex-col">
		{#key $focus}
			{#if blurbFor($focus)}
				<div class="blurb" in:fly={{ y: -50, duration: 500 }}>
					{@html blurbFor($focus)}
				</div>
			{/if}
		{/key}
	</div>
</header>

<style lang="postcss">
	header {
		@apply w-full p-2 space-y-2 mt-2 mx-5 flex flex-row flex-wrap lg:flex-nowrap items-start;
	}

	nav {
		@apply flex my-4 justify-between w-full min-w-fit text-base md:text-xl space-x-2 md:space-x-4 whitespace-nowrap;
	}

	.blurb {
		@apply flex justify-center text-center rounded-xl shadow-md bg-sky-400/30 p-5 max-w-prose;
	}

	input + span {
		@apply cursor-pointer text-white/80 px-2 py-1 text-base md:text-xl;
	}
	input:hover + span {
		@apply bg-white/10 rounded-md shadow-sm;
	}
	input:checked + span {
		@apply font-bold drop-shadow-md;
	}
</style>
