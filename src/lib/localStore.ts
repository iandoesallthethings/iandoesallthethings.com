import type { Writable } from 'svelte/store'
import { writable } from 'svelte/store'
import { browser } from '$app/environment'

export default function localStore<JsonValue>(
	key: string,
	initialValue: JsonValue
): Writable<JsonValue> {
	const store = writable(initialValue)

	if (browser) {
		const localStorageValue: JsonValue = JSON.parse(localStorage.getItem(key) || 'null')

		store.set(localStorageValue || initialValue)
		store.subscribe((value: JsonValue) => (localStorage[key] = JSON.stringify(value)))
	}
	return store
}
