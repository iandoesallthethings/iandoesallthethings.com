import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async function ({ url, fetch }) {
	const s3Url = url.searchParams.get('url')

	if (!s3Url) throw error(404, `Could not find asset: ${s3Url}`)

	return fetch(s3Url, {
		headers: {
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Origin': '*',
		},
	})
}
