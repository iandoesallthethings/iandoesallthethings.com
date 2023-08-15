import * as Projects from '$db/Projects'
import { error } from '@sveltejs/kit'

export const prerender = true

export async function entries() {
	const projects = await Projects.getAll()

	return projects.map(({ route }) => ({ projectName: route }))
}

export async function load({ params }) {
	const projectName = params.projectName
	console.debug('Rendering', projectName)

	if (!projectName) throw error(404)

	const project = await Projects.getPage(projectName)

	if (!project) throw error(404)

	return { project }
}
