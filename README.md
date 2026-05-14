# Personal Site

Made with Astro and Tailwind.

## 🌐 Localization

This site supports English (default) and Japanese localization.

### URL Structure

- **English**: `https://proffer.dev/` (no locale prefix)
- **Japanese**: `https://proffer.dev/ja/`

### Content Structure

Content is organized by locale in subdirectories:

```
src/
├── content/
│   ├── projects/
│   │   ├── en/        # English project files
│   │   └── ja/        # Japanese project files
│   └── experience/
│       ├── en/        # English experience files
│       └── ja/        # Japanese experience files
├── pages/
│   ├── index.astro    # English homepage
│   ├── 404.astro      # English 404
│   └── ja/
│       ├── index.astro    # Japanese homepage
│       └── 404.astro      # Japanese 404
└── utils/
    └── translations.ts    # UI text translations
```

### ⚠️ Important: Updating Content

**When making changes, remember to update BOTH locales:**

1. **Navigation/Components**: If you update the English navigation or any shared component, update the Japanese equivalent
2. **Content Collections**: When adding/updating projects or experience, create corresponding files in both `en/` and `ja/` directories
3. **UI Text**: Update translations in `src/utils/translations.ts` for both languages
4. **Pages**: Update both `/src/pages/` (English) and `/src/pages/ja/` (Japanese) pages

### Image Paths in Content

Content files in `en/` and `ja/` subdirectories use this path format:

```markdown
thumbnail: "../../../assets/images/image-name.jpg"
```

### Adding New Translations

To add new translatable UI text:

1. Add the key/value to both `en` and `ja` objects in `src/utils/translations.ts`
2. Use the `t()` function in components: `t(currentLocale, 'yourKey')`

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
