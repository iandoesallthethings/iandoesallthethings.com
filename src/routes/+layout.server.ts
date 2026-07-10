import * as Fields from '$db/Fields'
import * as Projects from '$db/Projects'

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
