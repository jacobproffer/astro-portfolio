# Personal Site

Made with Astro and Tailwind.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

### Asset scripts

These are one-off scripts you run by hand when an asset needs refreshing. Builds don't run them.

| Command                         | Action                                                                                                                                                                         |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run thumbnails`            | Scrapes each project's `og:image` (or `twitter:image` if missing), crops it to 1200×630 and saves it to the project's `thumbnail` path                                          |
| `npm run thumbnails -- <slug>`  | Same, but only for the named project files, e.g. `npm run thumbnails -- airports records`                                                                                      |
| `npm run social:image`          | Renders `scripts/social/social-image.html` to `public/images/social.jpg` at 1200×630 with headless Chrome                                                                      |
| `npm run resume:pdf`            | Prints `/resume` to `public/Jacob_Proffer_Resume.pdf` with headless Chrome (start `npm run dev` first)                                                                         |

`social:image` and `resume:pdf` expect Google Chrome at its default macOS path. Set `CHROME=/path/to/chrome` to use a different install.
