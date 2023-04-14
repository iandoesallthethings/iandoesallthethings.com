// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			fields: import('$types').Field[]
			projects: import('$types').Project[]
			project: import('$types').Project
		}
		// interface Platform {}
	}
}

export {}
