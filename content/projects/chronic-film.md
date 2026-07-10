---
name: Chronic Film
fields: [art, dev]
link: "http://chronicfilm.net"
published: true
video: ../attachments/chronic-film.mp4
indev: true
subtitle: A nearly eternal algorithm
---

A collaboration with [Alex Anikina](https://www.digitalearth.art/alexandra-anikina) to create a movie that encapsulates **Every Image that will ever exist.**

The wildly shortened version of the story is that it combinatorially iterates through every color channel (0-255) for every color channel (Red Green and Blue) for every pixel on the screen, with the original presentation being 720p. That means every frame of every movie that will ever be made, every photograph that will ever be taken, every view of YOUR life from every angle with every variation, etc etc.

<aside>
🔗 The film continues to play live now here: [chronicfilm.net](http://chronicfilm.net)

</aside>

## How it works

So after looking around for a [calculator that won’t overflow when it runs out of integers](https://mrob.com/pub/comp/hypercalc/hypercalc-javascript.html), we can calculate the length of this wonderful silent-film:

```markdown
3 channels ^ (256 values * (1280 * 720) pixels)
	= 3^235929600
	= 5.99112 × 10^112567026 frames

At ~30fps:
	5.99112 × 10^112567026 / 30
	= 1.99704 × 10^112567025 seconds

Which converted to years is: 
	1.99704 × 10^112567025 years
```

That’s uh... about 2 with 100 million zeros after it. Seems like an appropriate length for the omnifilm. 

The main way it does this in realtime is by treating all the channels of all the pixels as a stack of arrays with 256 values. 

1. Each step of the algorithm, the global pointer steps along those values
2. After 256 steps, the global index loops back around to 0, but the first array gets shifted over by one. 
3. After 256 rounds of 256 steps, the first array shifts back into alignment with all the others... but the second array shifts by 1.
4. For billions and billions of steps, the array shifting cascades down the stack, slowly iterating through every combination.

For the sake of visual interest, we also shuffled each array instead of iterating linearly from 0 to 255.

Another way to visualize this algorithm is as a clock with 1280 * 720 hands. Just as the minute hand clicks once each time the second hand makes one trip around the clock, each array shifts over once each time the previous array shifts 256 times. 

This is where we run into problems. We have to calculate when to shift each array. Those numbers get **B I G.** Like... 

# Really big.

This project was built in javascript for the sake of portability. I know, I know, we should use rust, but this was 2016. Things were different then. 😛

We tried several BigInt libraries to handle these numbers. All of them tanked the FPS of the video to sometimes less than a frame per second. We had to make a decision between the algorithm being ***correct*** and it being good art (meaning interesting enough to watch to make a statement). 

We decided in the end to let the integers overflow for now. The visual result is largely the same, and the budget (of time and energy as well as money) at the time didn’t really allow for solving major computing problems like that. 

<aside>
🖼️ The real point of the piece is that given an unreasonably powerful fleet of computers and trillions of trillions of trillions of years, we can preempt all visual art. Go figure. 🤷‍♂️

</aside>
