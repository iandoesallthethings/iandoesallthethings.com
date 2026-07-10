import * as Projects from '$db/Projects'
import { isr } from '$lib/isr'
import { error } from '@sveltejs/kit'

export const config = { isr }

export async function load({ params }) {
	const projectName = params.projectName

	if (!projectName) throw error(404)

	const project = await Projects.getPage(projectName)

	if (!project) throw error(404)

	return { project }
}
