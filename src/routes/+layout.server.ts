import type { LayoutServerLoad } from './$types'
import * as Fields from '$db/Fields'
import * as Projects from '$db/Projects'

export const load: LayoutServerLoad = async function () {
	const fields = Fields.getAll()
	const projects = Projects.getAll()

	return { fields, projects }
}
