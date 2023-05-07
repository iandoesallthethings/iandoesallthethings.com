import { error } from '@sveltejs/kit'
import { prisma } from '$db'

export async function load({ params }) {
	const projectName = params.projectName

	if (!projectName) throw error(404)

	const project = await prisma.project.findUnique({
		where: { route: projectName },
		include: { fields: true },
	})

	if (!project) throw error(404)

	return { project }
}
