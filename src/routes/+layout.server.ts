// import * as Fields from '$db/Fields'
// import * as Projects from '$db/Projects'
import { prisma } from '$db'

export async function load() {
	// const fields = Fields.getAll()
	// const projects = Projects.getAll()
	const fields = await prisma.field.findMany({
		where: { published: true },
	})

	const projects = await prisma.project.findMany({
		where: { published: true },
		include: { fields: true },
	})

	return { fields, projects }
}
