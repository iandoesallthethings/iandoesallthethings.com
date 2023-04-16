import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async function ({ url, fetch }) {
	const s3Url = url.searchParams.get('url')
	if (!s3Url) throw error(404)

	return fetch(s3Url)
}
