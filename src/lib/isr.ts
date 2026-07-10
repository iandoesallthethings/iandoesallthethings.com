import { env } from '$env/dynamic/private'

// Shared ISR config for content pages. Evaluated at build time on Vercel, so the
// env vars must be set in the Vercel project. Re-export from a route like:
//   export const config = { isr }
export const isr = {
	expiration: Number(env.ISR_EXPIRATION ?? 300),
	...(env.BYPASS_TOKEN ? { bypassToken: env.BYPASS_TOKEN } : {}),
}
