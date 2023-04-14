import { browser, dev } from '$app/environment'
import type { Page } from '@sveltejs/kit'
import { onCLS, onFCP, onFID, onLCP, onTTFB, type Metric } from 'web-vitals'
import { inject } from '@vercel/analytics'

const vitalsUrl = 'https://vitals.vercel-analytics.com/v1/vitals'
const analyticsId = import.meta.env.VERCEL_ANALYTICS_ID

export function initialize() {
	inject({ mode: dev ? 'development' : 'production' })

	return updateAnalytics
}

interface AnalyticsOptions {
	path: Page['url']['pathname']
	params: Page['params']
	analyticsId: string
	debug?: boolean
}

function updateAnalytics($page: Page) {
	if (!(browser && analyticsId)) return

	webVitals({
		path: $page.url.pathname,
		params: $page.params,
		analyticsId,
	})
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
		dsn: options.analyticsId,
		id: metric.id,
		page,
		href: location.href,
		event_name: metric.name,
		value: metric.value.toString(),
		speed: getConnectionSpeed(),
	}

	if (options.debug) {
		console.log('[Analytics]', metric.name, JSON.stringify(body, null, 2))
	}

	const blob = new Blob([new URLSearchParams(body as unknown as URLSearchParams).toString()], {
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
		// @ts-expect-error - Yeesh, what a mess
		'effectiveType' in navigator['connection']
		? navigator['connection']['effectiveType']
		: ''
}
