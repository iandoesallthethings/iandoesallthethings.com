import type { PageServerLoad } from './$types'
import * as Projects from '$db/Projects'
import { error } from '@sveltejs/kit'

export const load: PageServerLoad = async function ({ params }) {
	const projectName = params.projectName

	if (!projectName) throw error(404)

	const project = await Projects.getPage(projectName)

	if (!project) throw error(404)

	return { project }
}
