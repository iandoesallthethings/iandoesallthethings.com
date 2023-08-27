declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		interface PageData {
			fields: import('$types').Field[]
			projects: import('$types').Project[]
			project: Promise<import('$types').Project>
		}
		// interface Platform {}
	}
}

export {}
