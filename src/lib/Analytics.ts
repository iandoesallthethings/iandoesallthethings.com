import { dev } from '$app/environment'
import { inject } from '@vercel/analytics'

export function initialize() {
	inject({ mode: dev ? 'development' : 'production' })
}
