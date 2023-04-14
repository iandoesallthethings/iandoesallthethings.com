import { browser } from '$app/environment'
import FlowField from './FlowField'

import Container from '$lib/ukiyo/Container'
import Particle from '$lib/ukiyo/Particle'

const flowField = new FlowField()
if (browser) flowField.start()

export default function ukiyo(particleElement: HTMLElement, poolElement?: HTMLElement) {
	const pool = new Container(poolElement ?? (particleElement.parentNode as HTMLElement))

	const particle = new Particle(pool, particleElement)

	return {
		update: particle.update,
		destroy: particle.destroy,
	}
}
