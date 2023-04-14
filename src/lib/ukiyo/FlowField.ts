// @ts-expect-error This is a weird commonjs shim
import noisejs from 'noisejs'
const { Noise } = noisejs
import * as Numbers from '$lib/ukiyo/Numbers'
import type { Coordinate, Angle } from '$lib/ukiyo/Numbers'

export default class FlowField {
	// @ts-expect-error Old library is old
	noise: Noise
	z: number

	constructor() {
		this.noise = new Noise(Math.E)
		this.z = Math.random()

		this.start()
	}

	start() {
		this.flow()
	}

	flow() {
		this.z = Math.random()

		setTimeout(() => requestAnimationFrame(this.flow), Numbers.randomIntBetween(5000, 10000))
	}

	directionAt(coordinate: Coordinate, zOffset: number): Angle {
		const noiseValue = this.noise.perlin3(
			coordinate.x / 1000,
			coordinate.y / 1000,
			this.z + zOffset
		)

		return Numbers.clamp(noiseValue * 360 + 180, 0, 360)
	}
}
