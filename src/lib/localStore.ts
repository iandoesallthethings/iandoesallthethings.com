import type { Writable } from 'svelte/store'
import type { JsonObject, JsonValue } from '$lib/types'
import { writable } from 'svelte/store'
import { browser } from '$app/env'

export default function localStore<JsonValue>(
	key: string,
	initialValue: JsonValue
): Writable<JsonValue> {
	const store = writable(initialValue)

	if (browser) {
		store.set(JSON.parse(localStorage.getItem(key)) || initialValue)
		store.subscribe((value: JsonValue) => (localStorage[key] = JSON.stringify(value)))
	}
	return store
}
