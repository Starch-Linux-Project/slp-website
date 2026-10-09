# Cloudflare wiki setup

The wiki is served by the existing website at **https://starchlinuxproject.org/wiki/**. `/wiki` redirects to `/wiki/`. Articles use URLs such as `/wiki/installation/`.

## Existing deployment

- **Product:** Cloudflare Pages with GitHub integration (confirmed by the owner).
- **Repository:** `Starch-Linux-Project/slp-website`.
- **Project name:** not present in the repository; select the existing project serving `starchlinuxproject.org`. Do not create a second project.
- **Branch:** local `main` tracks `origin/main`. The older private handoff specifies production branch `main`; confirm this in the existing dashboard.
- **Previously documented settings:** framework None, build command `exit 0`, output `.`, root blank. These older settings were not independently verified against the dashboard.
- **New build:** Eleventy generates wiki pages and copies the existing public website to `dist/`.

## Manual dashboard actions

After these website changes are committed and pushed to GitHub:

1. Open **Workers & Pages**, select the existing Pages project for `starchlinuxproject.org`, and open its build settings.
2. Set **Build command** to `npm run build`.
3. Set **Build output directory** to `dist`.
4. Keep **Root directory** blank (repository root) and **Framework preset** as None. The explicit command runs Eleventy.
5. Confirm **Production branch** is `main` and automatic production deployments are enabled. If the existing project uses a different production branch, use that same branch in Pages CMS and publish the implementation there.
6. If build watch paths are restricted, include `content/**`, `public/wiki/images/**`, `src/**`, `lib/**`, `scripts/**`, `css/**`, `js/**`, `.pages.yml`, `eleventy.config.js`, `package.json`, `package-lock.json`, `.node-version`, `_headers`, `_redirects`, and existing public HTML/assets. Leaving the project's default all-files behavior is simplest.
7. Trigger a deployment of the new commit if saving the settings did not trigger one. Verify the deployment log reports the generated pages and successful validation.

Apply the same build command/output settings to preview deployments when separate settings are configured. Preview the change before publishing production when possible.

## Final Pages settings

| Setting | Value |
| --- | --- |
| Project | Existing project serving `starchlinuxproject.org`; name must be read from dashboard |
| Repository | `Starch-Linux-Project/slp-website` |
| Production branch | `main`, unless the dashboard confirms another existing branch |
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | Blank |
| Node.js | `22.23.3`, pinned in `.node-version` |
| Environment variables | None required by this implementation |

Pages installs npm dependencies from the package manifest/lockfile before building. Keep dependency installation enabled. If an existing `NODE_VERSION` override is configured, remove that override or align it with `.node-version`.

## Domain and DNS

**No additional DNS record is required because `/wiki/` is served by the existing `starchlinuxproject.org` deployment.** Keep the current custom domain and its DNS records. No wiki subdomain, new custom domain, or Worker route is needed.

## Workers settings

Not applicable. This implementation does not create a Worker, Pages Function, binding, or runtime database.

## Pages CMS

Use the hosted service at https://app.pagescms.org. Authorize its GitHub App for `Starch-Linux-Project/slp-website` and select the production branch.

The local `.pages.yml` describes `content/wiki/` articles, `content/wiki-categories/` categories, `content/wiki-home.md`, and uploads in `public/wiki/images/`. The public image URL prefix is `/wiki/images/`.

The owner created `.pages.yml` through Pages CMS during implementation. The `main` branch copy read from GitHub was empty at that time. Reconcile that remote commit before pushing local changes; preserve any newer owner configuration and make sure its content paths/fields match this build. Do not blindly overwrite a configuration that has since been filled in.

See [WIKI-EDITING.md](WIKI-EDITING.md) for the editing workflow and field contract.

## Secrets

No GitHub token, Cloudflare API token, OAuth secret, or other secret is required in the website repository or Cloudflare build environment. The owner authorizes Pages CMS through GitHub. The existing Cloudflare GitHub connection performs deployment.

## Verification still requiring the hosted accounts

1. Confirm the project name, production branch, build settings, and watch paths above.
2. Check whether GitHub branch rules allow Pages CMS to save directly to the production branch. If pull requests are required, the owner must merge changes before publication; saving alone will not publish them. Do not silently weaken branch protection.
3. In Pages CMS, create a test article, select a category, upload and insert a screenshot with an image description, and save.
4. Confirm Cloudflare automatically starts a build for that commit and the article/image appear on the custom domain.
5. Edit the title, category, order, and formatted content. Confirm the URL stays stable and the changes appear after deployment. Check that tables and fenced code survive the rich-text editor's save/reopen cycle.
6. Delete the test article, remove any links to it, and confirm the next deployment removes it from navigation and returns a 404 for its old URL.
7. Verify `/wiki`, `/wiki/`, article URLs, headers, and 404 behavior on the deployed site. A local Python server does not process Cloudflare `_redirects` or `_headers`.

Local checks cannot substitute for these authenticated CMS/deployment checks. A failed build leaves the last successful deployment in place; inspect its log and fix the named content field or link before saving again.

## References

- [Cloudflare build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Cloudflare Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare route and 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Pages CMS configuration](https://pagescms.org/docs/configuration/)
