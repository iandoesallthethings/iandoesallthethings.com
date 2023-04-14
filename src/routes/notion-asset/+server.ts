import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async function ({ url, fetch }) {
	const s3Url = url.searchParams.get('url')
	if (!s3Url) throw error(404)

	const searchParams = getSearchParams(s3Url)

	console.debug({
		s3Url,
		searchParams,
	})

	const asset = await fetch(s3Url, {
		headers: searchParams,
	})
	// console.debug(asset)

	return asset
}

function getSearchParams(url: string) {
	const paramString = new URLSearchParams(url.split('?')[1])
	console.debug({ paramString })
	const params = {}

	for (const param of paramString.entries()) {
		params[param[0]] = param[1]
	}

	return params
}
/*
https://s3.us-west-2.amazonaws.com/secure.notion-static.com/

46c07ba7-2330-4fb1-9882-d74c5a4b91c0/faceoff.mp4
X-Amz-Algorithm=AWS4-HMAC-SHA256
X-Amz-Content-Sha256=UNSIGNED-PAYLOAD
X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230414%2Fus-west-2%2Fs3%2Faws4_request
X-Amz-Date=20230414T170348Z
X-Amz-Expires=3600&X-Amz-Signature=954b9922a63aa9cb18440e1f428fc404387e658a60d10595456613a93a158d87
X-Amz-SignedHeaders=host
x-id=GetObject
*/
