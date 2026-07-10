---
name: Ronome 🦀
fields: [art, dev, music]
link: "https://github.com/iandoesallthethings/ronome"
published: true
video: ../attachments/ronome.mp4
indev: true
subtitle: A ferrous technicolor grid with an API as beautiful as its colors.
---

The Ronome (name pending) is my take on the Monome Grid. 

The DIY Grid is a well trod path, even with RGB Neopixel pads. There are plenty of build guides using various flavors of Arduino chips and Adafruit Neotrellis boards. But my experience working with the API was clunky. The default firmware doesn’t provide discrete control of both brightness and color, so the options are to pick a single color or to map brightness to some color palette. On top of that, C++ is far from my favorite language to work with. 

This project has 3 main goals:

1. Extend SerialOSC to pass separate color and brightness info per pixel
2. Unify the firmware and patching library to use a single language and wrap it all up with an elegant API that makes it easy to iterate, reason about, and build for the grid. 
3. Maintain compatibility with the wider Monome ecosystem so all the community built max patches and eurorack modules still work.
