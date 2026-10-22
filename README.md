# yangjimmy.github.io

Project portfolio for Jimmy Yang, built with React, React Router, Bootstrap 5 (react-bootstrap) and Vite.

## Run locally

Needs [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
One-time setup: in the repository on GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.

## Editing content

Everything shown on the site comes from two files:

| File | What it holds |
| --- | --- |
| `src/data/projects.js` | Categories and projects (description, technical details, tech stack, links, images) |
| `src/data/profile.js` | Name, intro, education, contact links, profile photo |

### Add a project

Copy an existing entry in the `projects` array and change:

- `slug`: unique, URL-safe id (used in `/#/project/<slug>`)
- `category`: one of the `id`s in `categories`
- `description`: paragraphs for the overview
- `details`: bullet points for the technical details section
- `featured: true` to also show it on the home page
- `subprojects` (optional): a list of `{ title, period, text, tech }` shown as small cards, for grouping short projects into one entry (see `ml-mini-projects` and `robotics-mini-projects`)

### Add images

1. Put files in `public/images/projects/<slug>/` (a folder already exists for each project).
2. Reference them from the project entry, without the `public/` prefix:

```js
cover: 'images/projects/amphibious-uav/cover.jpg',
figures: [
  { src: 'images/projects/amphibious-uav/cfd.png', caption: 'CFD results' },
],
```

Any figure with `src: null` (or a missing `cover`) shows a dashed placeholder with the path to drop the file into.
Images open in a lightbox when clicked. Wide images (16:9 for covers, 4:3 for figures) fit best.

For the profile photo, add `public/images/profile.jpg` and set `photo: 'images/profile.jpg'` in `profile.js`.

### Add a category

Add an entry to `categories` with an `id`, `title`, `blurb`, `accent` colour, and a [Bootstrap Icons](https://icons.getbootstrap.com) class for `icon`.

## Structure

```
src/
  data/         site content (edit these)
  pages/        Home, AllProjects, CategoryPage, ProjectPage, NotFound
  components/   navbar, cards, figure, animated hero canvas, typewriter, counters
  hooks/        useInView for scroll-reveal animations
  styles.css    theme tokens, CSS animations, component styles
```
