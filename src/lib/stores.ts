import localStore from '$lib/localStore'
import type { FieldName } from '$types'

const focus = localStore<FieldName>('focus', 'all the things')

export { focus }
