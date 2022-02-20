import localStore from '$lib/localStore'
import type { FieldName } from '$lib/types'

const focus = localStore<FieldName>( 'focus', 'all the things')
const darkMode = localStore('dark-mode', false)

export { focus, darkMode }
