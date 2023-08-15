// Fireworks - I stole this from the internet. :P
// https://codepen.io/whqet/pen/Auzch

import Firework from './Firework'
import Particle from './Particle'
import { random } from './helpers'

let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
let mx: number
let my: number
let cw: number
let ch: number
let mousedown = false
let playing = false

let hue = 120
let timerTick = 0
let limiterTick = 0
const limiterTotal = 0 // when launching fireworks with a click, too many get launched at once without a limiter, one launch per 5 loop ticks
const timerTotal = 20 // this will time the auto launches of fireworks, one launch per 80 loop ticks

const fireworks: Firework[] = []
const particles: Particle[] = []

// set canvas dimensions

export function start() {
	canvas = document.getElementById('canvas') as HTMLCanvasElement
	ctx = canvas.getContext('2d') as CanvasRenderingContext2D

	cw = window.innerWidth
	ch = window.innerHeight
	canvas.width = cw
	canvas.height = ch

	canvas.addEventListener('mousemove', mouseMove)
	canvas.addEventListener('mousedown', mouseDown)
	canvas.addEventListener('mouseup', mouseUp)

	playing = true
	loop()
}

export function stop() {
	canvas.removeEventListener('mousemove', mouseMove)
	canvas.removeEventListener('mousedown', mouseDown)
	canvas.removeEventListener('mouseup', mouseUp)
	playing = false
}

function loop() {
	console.debug('loop')
	if (playing) window.requestAnimationFrame(loop)

	// hue += 0.5 // increase the hue to get different colored fireworks over time
	hue = random(0, 360) // create random color

	// Don't clearRect() so we get a trailing effect
	// setting the composite operation to destination-out will allow us to clear the canvas at a specific opacity, rather than wiping it entirely
	ctx.globalCompositeOperation = 'destination-out'
	// decrease the alpha property to create more prominent trails
	ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
	ctx.fillRect(0, 0, cw, ch)
	// change the composite operation back to our main mode
	// lighter creates bright highlight points as the fireworks and particles overlap each other
	ctx.globalCompositeOperation = 'lighter'

	// loop over each firework, draw it, update it
	for (const [index, firework] of fireworks.entries()) {
		firework.draw()
		firework.update()

		if (firework.distanceTraveled >= firework.distanceToTarget) {
			createParticles(ctx, firework.tx, firework.ty)
			// remove the firework, use the index passed into the update function to determine which to remove
			fireworks.splice(index, 1)
		}
	}

	// loop over each particle, draw it, update it
	for (const [index, particle] of particles.entries()) {
		particle.draw()
		particle.update()

		if (particle.alpha <= particle.decay) {
			particles.splice(index, 1)
		}
	}

	// launch fireworks automatically to random coordinates, when the mouse isn't down
	if (timerTick >= timerTotal) {
		if (!mousedown) {
			// start the firework at the bottom middle of the screen, then set the random target coordinates, the random y coordinates will be set within the range of the top half of the screen
			fireworks.push(new Firework(ctx, cw / 2, ch, random(0, cw), random(0, ch / 2), hue))
			timerTick = 0
		}
	} else {
		timerTick++
	}

	// limit the rate at which fireworks get launched when mouse is down
	if (limiterTick >= limiterTotal) {
		if (mousedown) {
			// start the firework at the bottom middle of the screen, then set the current mouse coordinates as the target
			fireworks.push(new Firework(ctx, cw / 2, ch, mx, my, hue))
			limiterTick = 0
		}
	} else {
		limiterTick++
	}
}

function createParticles(ctx: CanvasRenderingContext2D, x: number, y: number) {
	let particleCount = 30
	while (particleCount--) {
		particles.push(new Particle(ctx, x, y, hue))
	}
}

function mouseDown(e: MouseEvent) {
	e.preventDefault()
	mousedown = true
}
function mouseUp(e: MouseEvent) {
	e.preventDefault()
	mousedown = false
}
function mouseMove(e: MouseEvent) {
	mx = e.pageX - canvas.offsetLeft
	my = e.pageY - canvas.offsetTop
}
