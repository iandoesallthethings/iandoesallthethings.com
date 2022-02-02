<script lang="ts">
	import { darkMode } from '$lib/stores'
</script>

<div
	on:click={() => ($darkMode = !$darkMode)}
	class="flex items-center justify-between w-full block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
>
	<div>Dark Mode</div>

	<button
		class="{$darkMode
			? 'bg-denim-400'
			: 'bg-gray-200'} relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ring-none "
	>
		<span
			aria-hidden="true"
			class="{$darkMode
				? 'translate-x-5'
				: 'translate-x-0'} pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
		>
			<i class="fas fa-{$darkMode ? 'moon' : 'sun'}" />
		</span>
	</button>
</div>
