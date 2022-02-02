# denkyuu.io

![GitHub package.json version](https://img.shields.io/github/package-json/v/iandoesallthethings/denkyuu.io)

## TODO

### Float.ts
- [x] Implement perlin noise field
- [x] Make particles drift
- [x] Refactor into svelte action
- [x] Implement draggability
- [ ] Make particles throwable (vector addition and scaling)
- [ ] Put all particles on same noise field
- [ ] Visualize noise field? (maybe p5js?)

### Content
- [x] Add thumbnails and dummy text to particles
- [ ] Implement notion database backend
- [ ] Curate and update projects
- [ ] Write article for each project

### Infrastructure
- [ ] Build pipeline
- [ ] Merge and Deploy!!

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
