import type { PageServerLoad } from './$types'
import * as Projects from '$db/Projects'
import isr from '$lib/isr'

export const config = { isr }

export const load: PageServerLoad = async function ({ params }) {
	const project = await Projects.getPage(params.projectName)

	return { project }
}
