<script lang="ts">
	import { darkMode } from '$lib/stores'
</script>

<div on:click={() => ($darkMode = !$darkMode)} class="wrapper">
	<button class="track">
		<span class="{$darkMode ? 'translate-x-5' : 'translate-x-0'} slide">
			<i class=" fas fa-{$darkMode ? 'moon' : 'sun'}" />
		</span>
	</button>
</div>

<style>
	.wrapper {
		@apply flex items-center justify-between w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100/20 rounded-md hover:text-gray-900 cursor-pointer;
	}

	.track {
		@apply relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none bg-gray-200/40;
	}

	.slide {
		@apply pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200;
	}
</style>
