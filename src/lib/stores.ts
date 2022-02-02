import localStore from '$lib/localStore'

const focus = localStore<'development' | 'music' | 'education' | 'all the things'>(
	'focus',
	'all the things'
)
const darkMode = localStore('dark-mode', false)

export { focus, darkMode }
