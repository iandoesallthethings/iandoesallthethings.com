import * as Fields from '$db/Fields'
import * as Projects from '$db/Projects'
import { env } from '$env/dynamic/private'

// ISR: pages render on demand, cache at the edge, and get revalidated either by
// the expiration ticking over or by the content webhook sending the bypass token
export const config = {
	isr: {
		expiration: Number(env.ISR_EXPIRATION ?? 300),
		...(env.BYPASS_TOKEN ? { bypassToken: env.BYPASS_TOKEN } : {}),
	},
}

export async function load() {
	try {
		const [fields, projects] = await Promise.all([Fields.getAll(), Projects.getAll()])

		return { fields, projects }
	} catch (error) {
		// A broken content fetch renders an empty (but alive) site; ISR retries after expiration
		console.error('Failed to load content:', error)
		return { fields: [], projects: [] }
	}
}
