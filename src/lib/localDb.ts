import { writable, get } from 'svelte/store'
import { browser } from '$app/env'

const db = writable()

db.fetchIfMissing = async () => {
	if (!browser || !get(db)) return

	db.update(async database => {
		if (!database) return await window.fetch(`/api.json`)
		else return database
	})

	return get(db)
}

export default db
