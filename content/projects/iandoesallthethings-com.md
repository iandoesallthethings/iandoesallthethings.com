---
name: iandoesallthethings.com
fields: [art, dev]
link: "https://iandoesallthethings.com"
published: true
video: ../attachments/iandoesallthethings.com.mp4
indev: true
subtitle: A goofy portfolio
---

### Ya ok sure bud, but what even is this?

Ah yes. I thought you'd ask. Long story short, this is the best way I could think to describe the type of work I do. It's a portfolio, an art showcase, an art piece itself, and also just a wonky excuse to play with perlin noise fields. So that actually makes this page recursive!

This web app is built using SvelteKit with the Notion API as a backend, and most importantly, NoiseJS. 

## Perlin Noise and Flow Fields

Tyler Hobbs has a great writeup of flow fields [here](https://tylerxhobbs.com/essays/2020/flow-fields). The short story version is that perlin noise generates random numbers on a grid that vary gradually. This is great for simulating things like landscapes and turbulence. 

I’m treating the noise like a pond. 

I used [NoiseJS](https://github.com/xixixao/noisejs), an old but very easy to use JS implementation of perlin noise. I’m considering switching to P5 so I can play around with visualizing the field in real time behind the blocks, but we’ll see. 

## Notion API

I’ve been wanting to harness Notion’s ease of editing and nice formatting ever since they announced their plans for a [public API](https://developers.notion.com/) over 9000 years ago. 

When it finally came out, it was alarmingly low level and didn’t exactly make it easy to harness the formatting. A couple of folx out there have built various incarnations of page parsers to process the block objects of a page, but they fell by the wayside and never ended up implementing all of the block types I wanted.

It took some doing. I basically had to manually reimplement every block type (and there are still a couple left on the todo list, like youtube embeds). 

But now my personal portfolio has all its content hosted in a nice, malleable notion DB with functionally instantaneous publishing!

If anyone’s interested in using this little library, please hit me up! With a little bit more work, it could be publishable as an NPM module.
