import { error } from '@sveltejs/kit'
import * as S3 from '$db/S3'

export const prerender = true

export async function GET({ params, fetch }) {
	const slug = params.url
	let { url, response } = S3.cache.get(slug) ?? {}

	if (!url) throw error(404, `Could not find asset: ${slug}`)

	if (response) return response

	response = fetch(slug)

	S3.cacheUrl(params.url, response)

	return response
}
