import { browser } from '$app/env'
import { writable, get, type Writable } from 'svelte/store'
import type { ProjectCache, Props } from '$lib/types'

export const cache = writable<ProjectCache>({})

export default async function cachedFetch(fetch, route): Promise<Props> {
	if (!browser) return await fetchedProject(fetch, route, cache)

	const cachedPages = get(cache)
	if (cachedPages[route]) return cachedProject(cachedPages, route)
	else return await fetchedProject(fetch, route, cache)
}

async function fetchedProject(fetch, route: string, cache: Writable<ProjectCache>): Promise<Props> {
	console.warn(`Cache miss on ${route}. Fetching...`)
	const response = await fetch(`/api/${route}.json`)
	const project = await response.json()

	setCache(cache, route, project)

	return {
		props: { project }
	}
}

function cachedProject(cachedPages: ProjectCache, route: string): Props {
	console.warn(`Cache hit on ${route}!`)
	const project = cachedPages[route]

	return {
		props: { project }
	}
}

function setCache(cache: Writable<ProjectCache>, route: string, project: Project) {
	const newCache = get(cache)
	newCache[route] = project
	cache.set(newCache)
}
