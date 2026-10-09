# Editing the Starch Linux wiki

The wiki lives at https://starchlinuxproject.org/wiki/. The website serves static pages; Pages CMS is the separate editing interface. No public account or editing endpoint is added to the website.

## One-time setup

1. Publish the website implementation and configure the existing Cloudflare project using [CLOUDFLARE-WIKI-SETUP.md](CLOUDFLARE-WIKI-SETUP.md).
2. Open https://app.pagescms.org, sign in with GitHub, and authorize the app for `Starch-Linux-Project/slp-website`.
3. Select that repository and its production branch, normally `main`.
4. Ensure the branch contains a populated `.pages.yml` matching the field contract below. An empty config file will not expose editing screens.

## Create or edit an article

The wiki starts with an editable homepage and no preset articles or categories. First create a category in **Wiki categories**, then add your first article. Empty categories remain hidden from public navigation until they contain an article.

Open **Starch Linux Wiki** and create an entry or select an existing one. Enter its title, short description, category, and navigation order. Write using the **Article** rich-text editor. Lower order numbers appear first within a category; use 10, 20, 30 to leave room between entries. Equal order numbers sort by title.

New filenames are based on the title. Use lowercase words separated by hyphens, such as `installation.md`. Do not use `index`, `images`, or `404`. The filename determines the public URL; changing a title later preserves that URL. File renaming is disabled in the supplied configuration to avoid breaking links.

Use the editor's image upload button to insert screenshots. Add an image description (alt text). Upload PNG, JPEG, WebP, or GIF files; the CMS writes them into the repository and inserts a `/wiki/images/...` URL. External images are blocked by the site's existing security policy. Optional cover images also need a **Cover image description**.

Save the entry. Pages CMS commits the change to GitHub; Cloudflare builds and publishes it automatically when that branch is connected with automatic builds enabled. Publication is not instantaneous: wait for the deployment to finish. Routine edits do not require local commands.

The public renderer supports headings, paragraphs, bold/italic, links, lists, code, fenced code blocks, blockquotes, images, and tables. Raw HTML is displayed as text. Template examples remain literal. The page title supplies the main heading; a Heading 1 inside an article is rendered as Heading 2. Confirm rich-text editor support for any complex formatting with a save/reopen test in the hosted CMS.

## Organize and delete

- **Wiki categories:** create or edit category names, descriptions, and order. Category title changes preserve existing article references. A new category appears publicly once it contains an article.
- **Wiki home:** edit the homepage title, description, and introduction. Category cards and article links are generated automatically.
- To move an article, select another category and save. Its URL remains unchanged.
- Before deleting a category, move its articles to another category. Otherwise the build reports a missing reference.
- Before deleting an article or image, remove links to it from other articles. Broken internal links/images stop publication and name the affected file in the build log. Automatic navigation updates itself.
- Intentional URL changes require a developer to add a redirect; routine title changes do not.

## Contract for an existing Pages CMS configuration

If you maintain `.pages.yml` through the Pages CMS website, keep these paths and stored values aligned with the build:

| Content | Repository path | Format and fields |
| --- | --- | --- |
| Articles | `content/wiki/*.md` | YAML frontmatter: `title`, `description`, `category`, `order`; Markdown `body`; optional `image`, `image_alt` |
| Homepage | `content/wiki-home.md` | YAML frontmatter: `title`, `description`; Markdown `body` |
| Categories | `content/wiki-categories/*.yml` | YAML: `title`, `description`, `order` |
| Uploads | `public/wiki/images/` | Public prefix `/wiki/images/` |

`category` stores the full repository path of a category, for example `content/wiki-categories/hardware.yml`. Use a single Pages CMS `reference` field with `value: "{path}"` and a label based on the category title. `order` is a non-negative number. Required titles, descriptions, and bodies cannot be empty. The build validates these rules and reports errors by filename.

## Local development

Install Node.js matching `.node-version`, then run:

```sh
npm ci
npm run build
npm test
npm run dev
```

The development command serves the complete site with the generated wiki. Alternatively, after building, run `python3 -m http.server 8000 --bind 127.0.0.1 --directory dist`. Serving the repository root alone does not generate wiki pages.

`npm run build` clears only the generated `dist/` directory, runs Eleventy, and checks public routes, internal links, image descriptions, configuration paths, and excluded source files. Commit source files and the lockfile; do not commit `dist/` or `node_modules/`.

## Build dependency maintenance

The implementation uses Eleventy 3.x and a lockfile. During setup, npm reported upstream denial-of-service advisories in Eleventy's transitive `braces` and `sprintf-js` dependency chains, with no compatible patched release offered by npm. These packages run in build/development tooling, not in the deployed static website. Recheck upstream fixes when updating dependencies; do not apply `npm audit fix --force` blindly, because its suggested Eleventy downgrade would replace the current major version.
