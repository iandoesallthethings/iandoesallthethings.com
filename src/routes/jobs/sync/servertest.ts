// import { Fields, Projects, prisma } from '$db'
// import { error, json } from '@sveltejs/kit'

// const cronKey = 'pleaseupdatethesitewithdatafromnotion'

// export async function GET({ url }) {
// 	if (url.searchParams.get('key') !== cronKey) throw error(403, 'Invalid key')

// 	const fields = await Fields.getAll()
// 	const projects = await Projects.getAllPages()

// 	// return json({ fields, projects })

// 	const fieldPromises = fields.map((field) => {
// 		prisma.field.upsert({
// 			where: { id: field.id },
// 			update: field,
// 			create: field,
// 		})
// 	})

// 	const projectPromises = projects.map((project) => {
// 		const fieldsForThisProject = fields
// 			.filter((field) => project.fields.includes(field.name))
// 			.map((field) => ({ id: field.id }))

// 		const newProject = {
// 			...project,
// 			fields: {
// 				connect: fieldsForThisProject,
// 			},
// 		}

// 		prisma.project.upsert({
// 			where: { id: project.id },
// 			update: newProject,
// 			create: newProject,
// 		})
// 	})

// 	const deleteOldProjectPromise = prisma.project.deleteMany({
// 		where: { id: { notIn: projects.map((project) => project.id) } },
// 	})

// 	const deleteOldFieldsPromise = prisma.field.deleteMany({
// 		where: { id: { notIn: fields.map((field) => field.id) } },
// 	})

// 	await Promise.all([
// 		...fieldPromises,
// 		...projectPromises,
// 		deleteOldProjectPromise,
// 		deleteOldFieldsPromise,
// 	])

// 	console.log('✨ Done ✨')
// 	return json({ fields, projects })
// }
