import type { LayoutServerLoad } from './$types'
import * as Fields from '$db/Fields'
import * as Projects from '$db/Projects'
import isr from '$lib/isr'

export const config = { isr }

export const load: LayoutServerLoad = async function () {
	const fields = await Fields.getAll()
	const projects = await Projects.getAll()

	return { fields, projects }
}
