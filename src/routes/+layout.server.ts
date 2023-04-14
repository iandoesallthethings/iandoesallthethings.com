import type { LayoutServerLoad } from './$types'
import * as Fields from '$lib/Fields'
import * as Projects from '$lib/Projects'

export const load: LayoutServerLoad = async function ({ params }) {
	const fields = await Fields.getAll()
	const projects = await Projects.getAll()

	return { fields, projects }
}

// function getPreferredFocus(url, fields) {
// 	const focusQuery = url.searchParams.get('f')
// 	const focusToPreload = fields.find((field) => field.name === focusQuery)
// 	if (focusToPreload) focus.set(focusToPreload.name)
// 	url.searchParams.delete('f')
// }
