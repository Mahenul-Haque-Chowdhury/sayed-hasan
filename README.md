# Sayed Hasan: Video Editor Portfolio

A single-page portfolio built around the idea **“Scroll through the edit.”**
Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion, and Lenis smooth scrolling.

```bash
npm run dev     # local development at http://localhost:3000
npm run build   # production build
npm run lint    # ESLint
```

## Updating content

All copy and media live in `src/content/`. No component changes needed.

| What | Where |
| --- | --- |
| Portfolio projects | `src/content/projects.ts` |
| Portrait, showreel, Upwork link, credentials | `src/content/site.ts` |
| Services and their illustrative timelines | `src/content/services.ts` |
| Process steps | `src/content/process.ts` |

### Adding a real project video

Each entry in `projects.ts` has `title`, `category`, `description`, `format`,
`thumbnail`, `videoUrl`, and `status`.

1. Describe the real project (`title`, `category`, `description`).
2. Optional: add a still to `public/work/` and set `thumbnail: "/work/your-still.jpg"`.
3. Set `videoUrl` to a **YouTube** link (recommended), a **Vimeo** link, a **Google Drive**
   file link shared as "Anyone with the link", or a direct **.mp4/.webm** file
   (e.g. put `public/work/reel.mp4` and use `"/work/reel.mp4"`). Drive works, but Google
   limits playback on busy public files, so YouTube (unlisted is fine) is more reliable.
4. Set `status: "published"`.

A project is only playable when it is `published` **and** has a `videoUrl`; anything else
shows the designed “Project preview coming soon” poster. Players load only after the visitor
presses play, so the page stays light.
Remote thumbnails need their host added to `images.remotePatterns` in `next.config.ts`.

### Hero showreel

Set `site.showreel.videoUrl` (and optionally `poster`) in `site.ts` to a direct video file.
It plays muted and looped inside the expanding hero frame, with pause and sound controls.
Leave it `null` to keep the designed composition.

### Portrait

The portrait is `public/sayed-hasan-from-editsbysayed.jpg`, imported in `site.ts`.
Replace the file (or change the import) to update it; set `portrait: null` to show the
typographic placeholder instead.

## Motion notes

- The hero expansion, project stack, and process playhead are scroll-linked and use only
  transforms and opacity, so they stay smooth.
- Lenis smooths wheel scrolling; touch devices keep native scrolling.
- With `prefers-reduced-motion`, smooth scrolling, pinning, and reveals are disabled and all
  content is shown immediately.
