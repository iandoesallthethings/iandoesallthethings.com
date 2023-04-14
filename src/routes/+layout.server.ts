import type { LayoutServerLoad } from './$types'
import * as Fields from '$db/Fields'
import * as Projects from '$db/Projects'
import type { FieldName } from '$types'

export const config = {
	isr: {
		expiration: 60 * 60 * 24, // 24 hours
	},
}

export const load: LayoutServerLoad = async function ({ url }) {
	const preferredFocus = (url.searchParams.get('f') as FieldName) ?? 'all the things'

	const fields = await Fields.getAll()
	const projects = await Projects.getAll()

	return { fields, projects, preferredFocus }
}

// function getPreferredFocus(url, fields) {
// 	const focusQuery = url.searchParams.get('f')
// 	const focusToPreload = fields.find((field) => field.name === focusQuery)
// 	if (focusToPreload) focus.set(focusToPreload.name)
// 	url.searchParams.delete('f')
// }
