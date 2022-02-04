import localStore from '$lib/localStore'
import { writable } from 'svelte/store'

const focus = localStore<'development' | 'music' | 'education' | 'all the things'>(
	'focus',
	'all the things'
)
const darkMode = localStore('dark-mode', false)

export { focus, darkMode }
