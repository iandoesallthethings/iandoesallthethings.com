import type { PageServerLoad } from './$types'
import * as Projects from '$db/Projects'

export const config = {
	isr: {
		expiration: 60 * 60 * 24, // 24 hours
	},
}

export const load: PageServerLoad = async function ({ params }) {
	const project = await Projects.getPage(params.projectName)

	return { project }
}
