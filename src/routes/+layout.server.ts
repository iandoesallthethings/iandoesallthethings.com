import * as Fields from '$db/Fields'
import * as Projects from '$db/Projects'

export const prerender = true

export async function load() {
	const fields = Fields.getAll()
	const projects = Projects.getAll()

	return { fields, projects }
}
