import { Fields, Projects, prisma } from '$db'
import { json } from '@sveltejs/kit'

export async function GET() {
	const fields = await Fields.getAll()
	const projects = await Projects.getAllPages()

	// return json({ fields, projects })

	const fieldPromises = fields.map((field) => {
		prisma.field.upsert({
			where: { id: field.id },
			update: field,
			create: field,
		})
	})

	const projectPromises = projects.map((project) => {
		const fieldsForThisProject = fields
			.filter((field) => project.fields.includes(field.name))
			.map((field) => ({ id: field.id }))

		const newProject = {
			...project,
			fields: {
				connect: fieldsForThisProject,
			},
		}

		prisma.project.upsert({
			where: { id: project.id },
			update: newProject,
			create: newProject,
		})
	})

	await Promise.all([...fieldPromises, ...projectPromises])

	console.log('✨ Done ✨')
	return json({ fields, projects })
}
