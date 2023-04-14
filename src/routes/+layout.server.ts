import type { LayoutServerLoad } from './$types'
import * as Fields from '$db/Fields'
import * as Projects from '$db/Projects'

export const config = {
	isr: {
		expiration: 60 * 60 * 24, // 24 hours
	},
}

export const load: LayoutServerLoad = async function () {
	const fields = await Fields.getAll()
	const projects = await Projects.getAll()

	return { fields, projects }
}
