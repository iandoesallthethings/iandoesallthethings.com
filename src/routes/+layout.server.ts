import * as Fields from '$db/Fields'
import * as Projects from '$db/Projects'

export const prerender = true

export async function load() {
	try {
		const [fields, projects] = await Promise.all([Fields.getAll(), Projects.getAll()])

		return { fields, projects }
	} catch (error) {
		// Notion is retired; the markdown data layer replaces this load entirely
		console.warn('Failed to load content:', error)
		return { fields: [], projects: [] }
	}
}
