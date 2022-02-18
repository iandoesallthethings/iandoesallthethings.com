export type Url = string

export interface Db {
	fields: Field[]
	projects: Project[]
}

export interface Field {
	name: 'education' | 'music' | 'development'
	blurb?: string
}

export interface Project {
	name: string
	title: string
	fields: Field[]
	link?: Url
	video?: Url
	image?: Url
	published?: boolean
	page?: { [key: string]: unknown }
}
