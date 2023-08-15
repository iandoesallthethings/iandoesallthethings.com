import { random } from './helpers'

export default class Particle {
	ctx: CanvasRenderingContext2D
	x: number
	y: number
	coordinates: number[][]
	coordinateCount: number
	angle: number
	speed: number
	friction: number
	gravity: number
	hue: number
	brightness: number
	alpha: number
	decay: number

	constructor(ctx: CanvasRenderingContext2D, x: number, y: number, hue: number) {
		this.ctx = ctx
		this.x = x
		this.y = y
		// track the past coordinates of each particle to create a trail effect, increase the coordinate count to create more prominent trails
		this.coordinates = []
		this.coordinateCount = 5
		while (this.coordinateCount--) {
			this.coordinates.push([this.x, this.y])
		}
		// set a random angle in all possible directions, in radians
		this.angle = random(0, Math.PI * 2)
		this.speed = random(1, 10)
		// friction will slow the particle down
		this.friction = 0.95
		// gravity will be applied and pull the particle down
		this.gravity = 1
		// set the hue to a random number +-50 of the overall hue variable
		this.hue = random(hue - 50, hue + 50)
		this.brightness = random(50, 80)
		this.alpha = 1
		// set how fast the particle fades out
		this.decay = random(0.015, 0.03)
	}

	update() {
		// remove last item in coordinates array
		this.coordinates.pop()
		// add current coordinates to the start of the array
		this.coordinates.unshift([this.x, this.y])
		// slow down the particle
		this.speed *= this.friction
		// apply velocity
		this.x += Math.cos(this.angle) * this.speed
		this.y += Math.sin(this.angle) * this.speed + this.gravity
		// fade out the particle
		this.alpha -= this.decay
	}

	// draw particle
	draw() {
		this.ctx.beginPath()
		// move to the last tracked coordinates in the set, then draw a line to the current x and y
		this.ctx.moveTo(
			this.coordinates[this.coordinates.length - 1][0],
			this.coordinates[this.coordinates.length - 1][1]
		)
		this.ctx.lineTo(this.x, this.y)
		this.ctx.strokeStyle =
			'hsla(' + this.hue + ', 100%, ' + this.brightness + '%, ' + this.alpha + ')'
		this.ctx.stroke()
	}
}
