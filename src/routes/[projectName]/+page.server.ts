import * as Projects from '$db/Projects'
import { error } from '@sveltejs/kit'

export const prerender = true

export async function entries() {
	try {
		const projects = await Projects.getAll()

		return projects.map(({ route }) => ({ projectName: route }))
	} catch (error) {
		// Notion is retired; the markdown data layer replaces this load entirely
		console.warn('Failed to load project entries:', error)
		return []
	}
}

export async function load({ params }) {
	const projectName = params.projectName
	console.log('Rendering', projectName)

	if (!projectName) throw error(404)

	const project = await Projects.getPage(projectName)

	if (!project) throw error(404)

	return { project }
}
