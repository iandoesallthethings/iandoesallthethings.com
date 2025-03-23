# iandoesallthethings.com

![GitHub package.json version](https://img.shields.io/github/package-json/v/iandoesallthethings/denkyuu.io)

![GitHub deployments](https://img.shields.io/github/deployments/iandoesallthethings/denkyuu.io/production?label=production&logo=vercel)

## TODO

### Float.ts features

- [x] Implement perlin noise field
- [x] Make particles drift
- [x] Refactor into svelte action
- [x] Implement draggability
- [x] Put all particles on same noise field
- [x] Vary z by small amount for each particle to prevent bunching
- [x] Pop clicked particles to front
- [x] Implement Vercel ISR
- [ ] Make particles throwable (vector addition and momentum scaling)
- [ ] Push focused particles toward the top? (i.e. pass in `target` and push toward it)
- [ ] Visualize noise field? (maybe p5js?)

### Content

- [x] Add thumbnails and dummy text to particles
- [x] Filter displayed particles by field
- [x] Implement notion database backend
- [ ] Curate and update projects
- [ ] Write article for each project

### Infrastructure

- [x] Build pipeline
- [x] Merge and Deploy!!

### Bugs

- [ ] Animations opening pages are jerky and weird

## Developing

```bash
# Install dependencies
yarn install

# Start the dev server
npm run dev

# Or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Theoretically, this app should work with `adapter-static`. Then:

```bash
# Build the production version to test locally
yarn build

# Or build and deploy to AWS
yarn deploy
```

> You can preview the built app with `yarn preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
