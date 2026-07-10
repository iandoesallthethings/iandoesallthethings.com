# Migrate to Markdown

Replace Notion-as-CMS with markdown-as-CMS: content lives in `content/` (an Obsidian
vault) in this repo, the site renders it at request time, and content updates go live
without a build. Tracked in beads (`bd list`); this doc is the design record.

## Goals

1. Content is effortlessly updatable (edit markdown, commit, push — done)
2. Content updates never require a build/deploy
3. The site renders faithfully what the editor (Obsidian) shows
4. Less code: delete all Notion parsing, the S3 signed-URL proxy, and dead Postgres

## Current state (July 2026)

- Deployed site = `main`, fully prerendered at build time from the Notion API.
  Static snapshot, frozen since May 2024. Fast but violates goal 2 by design.
- Content already migrated: `content/projects/*.md` (22), `content/fields/*.md` (5),
  `content/attachments/*` (55 files, ~12MB, largest 1.1MB). Frontmatter normalized
  (lists, booleans, `../attachments/` paths). Filenames are route slugs.
- Notion source-of-truth is retired. The old Notion/S3/Postgres code is now deletable.
- Toolchain is Svelte 4 / Kit 2.5 / Vite 5, two years stale.

## Architecture

```
content/ (Obsidian vault, this repo, public)
   │ git push (deliberate — no auto-sync plugins)
   ├─ code changed?    → Vercel builds & deploys as usual
   └─ content only?    → Vercel Ignored Build Step skips the build
                       → GitHub push webhook → /api/revalidate
                       → ISR bypass-token request per changed path (+ /)
                       → pages re-render on next visit, live in seconds

Request path (prod):
  ISR-cached SvelteKit server render
    → resolve HEAD sha of main (GitHub API, cached with the page)
    → fetch markdown via GitHub Contents API (token; avoids raw CDN staleness)
    → unified pipeline → HTML
    → media rendered as SHA-pinned raw.githubusercontent.com URLs
      (immutable, cache-busting by construction, GitHub CDN serves the bytes)

Request path (dev): read content/ straight off the filesystem.
```

### Markdown pipeline

`remark-parse` → `remark-gfm` → `@flowershow/remark-wiki-link` (wikilinks/embeds,
Obsidian resolution) → `@r4ai/remark-callout` → `remark-rehype` → `rehype-sanitize`
(schema extended for callout `data-*` attrs) → syntax highlighting → HTML string,
rendered with `{@html}` as today. `![[foo.mp4]]` / frontmatter `image`/`video`
resolve to attachment URLs (dev: local route; prod: SHA-pinned raw URL).

### Content model

Frontmatter replaces the Notion databases:

- **Project** (`content/projects/<slug>.md`): `name`, `subtitle`, `fields` (list),
  `link`, `image`/`video` (relative path into `attachments/`), `published`, `indev`.
  Slug = filename = route.
- **Field** (`content/fields/<slug>.md`): `name`, `blurb`, `order`, `published`.

Loader must be lenient: a malformed file is skipped with a warning, never a crash
(a bad content push must not take down rendering or block code deploys).

## Decisions

| Decision | Choice | Rejected alternatives |
|---|---|---|
| CMS | Obsidian vault in this repo | Notion (retired); Obsidian Sync + headless CLI (works, but adds a subscription-shaped dependency; revisit if mobile editing matters) |
| Repo layout | Monorepo, `content/` next to code | Separate content repo (more glue: deploy hook + token fetch); git submodule (pins a commit — defeats the whole point) |
| Content freshness | ISR + on-demand revalidation via webhook | Rebuild per content push (works but couples content to CI); TTL-only SWR (fallback if webhook annoys us) |
| Content fetch | GitHub Contents API with token, ref-pinned | raw.githubusercontent branch URLs (CDN caches ~5 min — breaks instant revalidation); bundling content into the deploy (can't update without deploy) |
| Media serving | SHA-pinned raw URLs, direct from GitHub CDN | Vercel Blob lazy mirror (right answer if media outgrows git; not needed at 12MB); serving through our own functions (4.5MB response cap, pointless egress) |
| Markdown | unified/remark at request time | mdsvex (build-time preprocessor — wrong tool for out-of-build content); `remark-obsidian` all-in-one (GPL-3.0) |
| Framework | Svelte 5 + current Kit 2.x | Staying on Svelte 4 (two years stale; runes migration is automated and Svelte 4 syntax still runs) |

## Phases

Each phase is a beads issue (`bd list` for live status). IDs share the
`iandoesallthethings_com-` prefix, abbreviated here.

1. **Foundation** (`-31t`) — branch `v4` off `main`; land `content/`, `docs/`,
   `.beads/`. The `update-everything` branch is superseded (its dep bumps are
   redone better in phase 2; the dirty working tree there is debug junk, stashed
   for safety).
2. **Toolchain upgrade** (`-91t`) — Svelte 5, Kit ≥2.69.1, Vite 7,
   `npx sv migrate svelte-5`; eslint/prettier/svelte-check current and green. The
   Notion data layer may be broken at this point (key likely dead); acceptable —
   it's deleted in phase 4.
3. **Markdown data layer (filesystem mode)** (`-3u9`) — frontmatter loader
   (lenient), unified pipeline with Obsidian plugins, `/attachments/*` dev route;
   replace `Projects.getAll()` / `Fields.getAll()`. Site fully works locally with
   zero network calls.
4. **Delete the old world** (`-7x9`) — `Notion.ts`, `S3.ts`, `Projects.ts`,
   `Fields.ts`, `notion-asset` route, `jobs/` dead code, `@notionhq/client`,
   `@vercel/postgres`; revoke the old Notion key, delete the Vercel Postgres
   store, prune `.env`.
5. **Visual parity + Svelte 5 idioms** (`-ryn`) — port components to runes where
   the migration left legacy patterns; verify pool/particles/fireworks/filters/
   project modal against the live site.
6. **Remote content mode** (`-v7k`) — GitHub fetch layer (Contents API + HEAD-sha
   resolution, SHA-pinned media URLs), dev/prod mode switch, ISR config with
   `bypassToken`, env: `GITHUB_TOKEN` (or none if rate limits allow), `CONTENT_REF`.
7. **Publish loop** (`-cpx`) — `/api/revalidate` (verify GitHub webhook HMAC, map
   changed files → routes, fire `x-prerender-revalidate` per path + `/`), Vercel
   Ignored Build Step (`git diff --quiet HEAD^ HEAD -- . ':(exclude)content/'`),
   GitHub webhook config; end-to-end test: push content-only commit, see it live,
   no build.
8. **Vault ergonomics + content cleanup** (`-ikk`) — `.obsidian/` in `content/`
   (gitignore `workspace.json`), fix stale content (localhost link in
   fields/music.md, sapper dupe in fields/dev.md), curate.
9. **Launch** (`-7br`) — Playwright smoke tests, deploy, verify prod +
   revalidation on the real domain, update README.

## Launch wiring (dashboard steps, phase 9)

The publish loop is code-complete but needs three one-time hookups at launch:

1. **Vercel env vars**: `BYPASS_TOKEN` (32+ random chars, used for ISR on-demand
   revalidation), `WEBHOOK_SECRET` (random, shared with the GitHub webhook),
   `GITHUB_TOKEN` (fine-grained, read-only contents on this repo — raises the
   API rate limit for sha/dir-listing calls). Optional: `ISR_EXPIRATION`
   (default 300s).
2. **GitHub webhook** (repo settings): payload URL
   `https://www.iandoesallthethings.com/api/revalidate`, content type
   `application/json`, secret = `WEBHOOK_SECRET`, events: just pushes.
3. **Ignored Build Step**: `vercel.json`'s `ignoreCommand` handles it; verify
   in Vercel project settings that vercel.json is respected (no dashboard
   override configured).

Also at launch: revoke the old Notion API key, delete the Vercel Postgres store,
and point production at the `v4` branch (or merge to main).

## Open questions

- Tailwind 3 → 4: bump during phase 2 or defer? (Independent of everything else.)
- Rate limits without a token: public repo raw fetches are unauthenticated-OK for
  media, but the Contents API wants a token for headroom. Decide in phase 6.
- `education` exists as both a field and a project route — fine today (different
  namespaces) but the route namespace is flat; watch for slug collisions.
