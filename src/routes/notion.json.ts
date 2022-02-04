import notion from '$lib/notion'

const fieldsId = process.env.NOTION_FIELDS_DB
const projectsId = process.env.NOTION_PROJECTS_DB

export async function get (): Promise<Partial<Response>> {
	const sorts = [{ property: 'order', direction: 'ascending' }]

	const fields = (await notion.databases.query({ database_id: fieldsId, sorts })).results.map(
		async dbPage => {
			const name = dbPage.properties.name.title[0].plain_text
			const blurb = dbPage.properties.blurb.rich_text
			const page = await notion.blocks.children.list({ block_id: dbPage.id })

			return { name, blurb, page }
		}
	)

	const projects = (await notion.databases.query({ database_id: projectsId })).results
		.filter(dbPage => dbPage.properties.published.checkbox)
		.map(async dbPage => {
			const route = dbPage.properties.route.rich_text[0].plain_text
			const name = dbPage.properties.name.title[0].plain_text
			const image = dbPage.properties.image?.files[0]?.file.url
			const video = dbPage.properties.video?.files[0]?.file.url
			const fields = dbPage.properties.fields.multi_select.map(f => f.name)
			const link = dbPage.properties.link.url
			const page = await notion.blocks.children.list({ block_id: dbPage.id })

			return { name, route, fields, image, video, link, page }
		})

	const db = {
		fields: [...(await Promise.all(fields)), { name: 'all the things' }],
		projects: await Promise.all(projects)
	}

	return { body: db }
}
