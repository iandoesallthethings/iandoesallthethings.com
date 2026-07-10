# iandoesallthethings.com

![GitHub deployments](https://img.shields.io/github/deployments/iandoesallthethings/denkyuu.io/production?label=production&logo=vercel)

Personal portfolio. Projects float around a perlin-noise pool; content lives in an
Obsidian vault right here in the repo.

## How it works

- **Content** is markdown in [`content/`](content/) — an Obsidian vault. Frontmatter
  replaces what used to be Notion database properties; `content/attachments/` holds
  media. See [`docs/migrate-to-markdown.md`](docs/migrate-to-markdown.md) for the
  architecture and migration plan.
- **Rendering** is a unified/remark pipeline with Obsidian extensions (wikilinks,
  embeds, callouts) in [`src/db/Markdown.ts`](src/db/Markdown.ts).
- **Stack**: SvelteKit (Svelte 5) on Vercel, bun for package management, Node 22
  runtime. Tasks are tracked with [beads](https://github.com/steveyegge/beads)
  (`bd ready` to see what's next).

## Developing

```bash
bun install
bun dev
```

## Testing

```bash
bun run test        # playwright + vitest
bun run check       # svelte-check
bun run lint        # prettier + eslint
```

## Building

```bash
bun run build
bun run preview
```

Deploys to Vercel on push.
