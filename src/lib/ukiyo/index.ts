import { browser } from '$app/environment'
import FlowField from '$ukiyo/FlowField'
import Container from '$ukiyo/Container'
import Particle from '$ukiyo/Particle'

// This flowfield is global to the app
let flowField: FlowField

if (browser) {
	flowField = new FlowField()
}

export default function ukiyo(particleElement: HTMLElement, poolElement?: HTMLElement) {
	if (!flowField) return

	const pool = new Container(poolElement ?? (particleElement.parentNode as HTMLElement))

	const particle = new Particle(flowField, pool, particleElement)

	return {
		update: particle.update,
		destroy() {
			flowField.destroy()
			particle.destroy()
		},
	}
}
