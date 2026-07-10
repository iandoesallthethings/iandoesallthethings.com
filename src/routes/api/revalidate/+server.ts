import crypto from 'node:crypto'
import * as Projects from '$db/Projects'
import { env } from '$env/dynamic/private'
import { error, json } from '@sveltejs/kit'

// GitHub push webhook → re-render the ISR pages affected by changed content files.
// Content-only pushes skip the Vercel build (see vercel.json ignoreCommand), so this
// endpoint is what makes vault edits go live — in seconds, with no deploy.

interface PushPayload {
	ref: string
	commits?: { added: string[]; removed: string[]; modified: string[] }[]
}

export async function POST({ request, url }) {
	const secret = env.WEBHOOK_SECRET
	const bypassToken = env.BYPASS_TOKEN

	if (!secret || !bypassToken) throw error(503, 'Revalidation is not configured')

	const body = await request.text()
	verifySignature(body, request.headers.get('x-hub-signature-256'), secret)

	if (request.headers.get('x-github-event') !== 'push') {
		return json({ revalidated: [], reason: 'not a push event' })
	}

	const payload: PushPayload = JSON.parse(body)
	const ref = env.CONTENT_REF || 'main'

	if (payload.ref !== `refs/heads/${ref}`) {
		return json({ revalidated: [], reason: `not the ${ref} branch` })
	}

	const paths = await affectedPaths(payload)
	const results = await Promise.all(
		paths.map(async (path) => {
			const response = await fetch(new URL(path, url.origin), {
				headers: { 'x-prerender-revalidate': bypassToken },
			})

			return { path, status: response.status }
		})
	)

	return json({ revalidated: results })
}

function verifySignature(body: string, signature: string | null, secret: string) {
	if (!signature) throw error(401, 'Missing signature')

	const expected =
		'sha256=' + crypto.createHmac('sha256', secret).update(body, 'utf-8').digest('hex')

	const valid =
		signature.length === expected.length &&
		crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))

	if (!valid) throw error(401, 'Bad signature')
}

async function affectedPaths(payload: PushPayload): Promise<string[]> {
	const changed = (payload.commits ?? []).flatMap((commit) => [
		...commit.added,
		...commit.removed,
		...commit.modified,
	])

	const content = changed.filter((file) => file.startsWith('content/'))

	if (content.length === 0) return []

	// Fields and attachments feed every page; project notes only feed their own page
	// (plus the homepage, which lists all projects)
	const broad = content.some((file) => !file.startsWith('content/projects/'))

	const projectSlugs = content
		.map((file) => file.match(/^content\/projects\/(.+)\.md$/)?.[1])
		.filter((slug) => slug !== undefined)

	if (!broad) return ['/', ...projectSlugs.map((slug) => `/${slug}`)]

	const projects = await Projects.getAll()

	return ['/', '/contact', ...projects.map((project) => `/${project.route}`)]
}
