import { error } from '@sveltejs/kit'
import * as S3 from '$db/S3'

export const prerender = true

export async function GET({ params, fetch }) {
	const { url, response } = S3.cache.get(params.url) ?? {}
	if (!url) throw error(404, `Could not find asset: ${params.url}`)

	return response ?? fetch(url)
}
