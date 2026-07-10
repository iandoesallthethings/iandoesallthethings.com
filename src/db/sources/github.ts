import { env } from '$env/dynamic/private'
import { parseNote, type Note } from '$db/Note'
import type { ContentSource } from '$db/Content'

const defaultRepo = 'iandoesallthethings/iandoesallthethings.com'

const shaTtlMs = 60_000
let cachedSha: { sha: string; at: number } | undefined

function repo() {
	return env.CONTENT_REPO || defaultRepo
}

function apiHeaders(): Record<string, string> {
	return {
		accept: 'application/vnd.github+json',
		'user-agent': 'iandoesallthethings.com',
		...(env.GITHUB_TOKEN ? { authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
	}
}

// Resolve the branch to a commit sha so every fetch within a render is consistent
// and every media URL is immutable (GitHub's CDN caches branch paths for ~5 minutes,
// but sha-pinned paths forever)
async function resolveSha(): Promise<string> {
	if (cachedSha && Date.now() - cachedSha.at < shaTtlMs) return cachedSha.sha

	const ref = env.CONTENT_REF || 'main'
	const response = await fetch(`https://api.github.com/repos/${repo()}/commits/${ref}`, {
		headers: apiHeaders(),
	})

	if (!response.ok) throw new Error(`Could not resolve content ref ${ref}: ${response.status}`)

	const { sha } = await response.json()
	cachedSha = { sha, at: Date.now() }

	return sha
}

function rawUrl(sha: string, ...segments: string[]) {
	const path = segments.map(encodeURIComponent).join('/')

	return `https://raw.githubusercontent.com/${repo()}/${sha}/content/${path}`
}

export async function open(): Promise<ContentSource> {
	const sha = await resolveSha()

	async function getNote(collection: string, slug: string): Promise<Note | undefined> {
		const response = await fetch(rawUrl(sha, collection, slug + '.md'))

		if (!response.ok) {
			console.warn(`Skipping unreadable note ${collection}/${slug}: ${response.status}`)
			return undefined
		}

		return parseNote(slug, await response.text())
	}

	async function getCollection(collection: string): Promise<Note[]> {
		const response = await fetch(
			`https://api.github.com/repos/${repo()}/contents/content/${collection}?ref=${sha}`,
			{ headers: apiHeaders() }
		)

		if (!response.ok) {
			console.warn(`Could not list content collection ${collection}: ${response.status}`)
			return []
		}

		const entries: { name: string; type: string }[] = await response.json()
		const slugs = entries
			.filter((entry) => entry.type === 'file' && entry.name.endsWith('.md'))
			.map((entry) => entry.name.slice(0, -3))

		const notes = await Promise.all(slugs.map((slug) => getNote(collection, slug)))

		return notes.filter((note) => note !== undefined)
	}

	function attachmentUrl(filename: string): string {
		return rawUrl(sha, 'attachments', filename)
	}

	return { getCollection, getNote, attachmentUrl }
}
