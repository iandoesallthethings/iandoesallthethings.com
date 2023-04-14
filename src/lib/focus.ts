import localStore from '$lib/localStore'
import type { FieldName } from '$types'

export default localStore<FieldName>('focus', 'all the things')
