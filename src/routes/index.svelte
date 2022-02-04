<script context="module">
	import { browser } from '$app/env'
	import { get } from 'svelte/store'
	import dbStore from '$lib/localDb'

	export async function load({ fetch }) {
		if (browser) {
			const cachedDb = get(dbStore)
			if (cachedDb) return { props: { db: cachedDb } }
		}

		const res = await fetch(`/notion.json`)
		const db = await res.json()

		return { props: { db } }
	}
</script>

<script lang="ts">
	import localDb from '$lib/localDb'
	export let db

	$localDb = db
</script>
