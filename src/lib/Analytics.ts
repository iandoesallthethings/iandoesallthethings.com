import { browser, dev } from '$app/environment'
import type { Page } from '@sveltejs/kit'
import { onCLS, onFCP, onFID, onLCP, onTTFB, type Metric } from 'web-vitals'
import { inject } from '@vercel/analytics'
import { PUBLIC_VERCEL_ANALYTICS_ID as analyticsId } from '$env/static/public'

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'

console.debug('[Analytics] Id:', analyticsId)

export function initialize() {
	inject({ mode: dev ? 'development' : 'production' })

	return updateAnalytics
}

function updateAnalytics($page: Page) {
	if (!(browser && analyticsId)) return

	webVitals({
		path: $page.url.pathname,
		params: $page.params,
		analyticsId,
	})
}

interface AnalyticsOptions {
	path: Page['url']['pathname']
	params: Page['params']
	analyticsId: string
	debug?: boolean
}

export function webVitals(options: AnalyticsOptions) {
	try {
		onFID((metric) => sendToAnalytics(metric, options))
		onTTFB((metric) => sendToAnalytics(metric, options))
		onLCP((metric) => sendToAnalytics(metric, options))
		onCLS((metric) => sendToAnalytics(metric, options))
		onFCP((metric) => sendToAnalytics(metric, options))
	} catch (err) {
		console.error('[Analytics]', err)
	}
}

function sendToAnalytics(metric: Metric, options: AnalyticsOptions) {
	const page = Object.entries(options.params).reduce(
		(acc, [key, value]) => acc.replace(value, `[${key}]`),
		options.path
	)

	const body = {
		dsn: options.analyticsId, // qPgJqYH9LQX5o31Ormk8iWhCxZO
		id: metric.id, // v2-1653884975443-1839479248192
		page, // /blog/[slug]
		href: location.href, // https://{my-example-app-name-here}/blog/my-test
		event_name: metric.name, // TTFB
		value: metric.value.toString(), // 60.20000000298023
		speed: getConnectionSpeed(), // 4g
	} as unknown as URLSearchParams

	if (options.debug) {
		console.log('[Analytics]', metric.name, JSON.stringify(body, null, 2))
	}

	const blob = new Blob([new URLSearchParams(body).toString()], {
		// This content type is necessary for `sendBeacon`
		type: 'application/x-www-form-urlencoded',
	})

	if (navigator.sendBeacon) {
		navigator.sendBeacon(vitalsUrl, blob)
	} else
		fetch(vitalsUrl, {
			body: blob,
			method: 'POST',
			credentials: 'omit',
			keepalive: true,
		})
}

function getConnectionSpeed() {
	return 'connection' in navigator &&
		navigator['connection'] &&
		//@ts-expect-error This is a mess, but whatever.
		'effectiveType' in navigator['connection']
		? navigator['connection']['effectiveType']
		: ''
}
