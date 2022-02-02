import localStore from '$lib/localStore'

const focus = localStore('focus', 'development')
const darkMode = localStore('dark-mode', false)

export { focus, darkMode }
