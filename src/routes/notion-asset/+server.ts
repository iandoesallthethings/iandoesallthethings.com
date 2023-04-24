import { error } from '@sveltejs/kit'

export async function GET({ url, fetch }) {
	const s3Url = url.searchParams.get('url')

	if (!s3Url) throw error(404, `Could not find asset: ${s3Url}`)

	return fetch(s3Url)
}
