import type { LayoutLoad } from './$types'
import type { FieldName } from '$types'
import focus from '$lib/focus'

export const load: LayoutLoad = async function ({ data, url }) {
	const preferredFocus = (url.searchParams.get('f') as FieldName) ?? 'all the things'

	focus.set(preferredFocus)
	url.searchParams.delete('f')

	return data
}
