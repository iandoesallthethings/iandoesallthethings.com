import type { PageServerLoad } from './$types'
import * as Projects from '$lib/Projects'

export const config = {
	isr: {
		expiration: 60 * 60 * 24, // 24 hours
	},
}

export const load: PageServerLoad = async function ({ params }) {
	return await Projects.getPage(params.projectName)
}
