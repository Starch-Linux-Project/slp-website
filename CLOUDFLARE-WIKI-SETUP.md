# Cloudflare wiki setup

The website and wiki deploy together at **https://starchlinuxproject.org/wiki/**. No separate wiki host is needed.

## Existing deployment

The build log supplied on October 9, 2026 confirms **Cloudflare Workers Builds with Static Assets**, worker **`slp-website`**, connected to GitHub repository **`Starch-Linux-Project/slp-website`**. The earlier assumption that this deployment was Cloudflare Pages was incorrect.

The timed-out deployment ran `npx wrangler deploy` without a repository Wrangler configuration. Wrangler's automatic setup selected `npm run dev` and `_site`. The development command starts a server and watches forever; the actual output directory is `dist`. Eleventy generated the wiki successfully, but deployment never reached the upload step.

`wrangler.jsonc` now declares the worker name and the correct static asset directory, so Wrangler does not need to infer them. Wrangler is pinned in the package manifest and lockfile to the version in the supplied log.

## Required dashboard settings

After committing and pushing this fix, open **Workers & Pages → slp-website → Settings → Build** and set:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | Repository root; leave the optional field blank |
| Production branch | `main`, unless the existing Git connection uses another branch |
| Asset/output directory | `dist`, configured in `wrangler.jsonc` |
| Node.js | `22.23.3`, pinned in `.node-version` and confirmed in the supplied log |
| Additional environment variables | None required |

1. Set the **Build command** to `npm run build`. Do not use `npm run dev` or `eleventy --serve` in deployment settings.
2. Keep the **Deploy command** as `npx wrangler deploy`.
3. Confirm the root directory and production branch above. The exact branch must match the branch edited in Pages CMS.
4. Start a build of the commit containing `wrangler.jsonc`. Retrying an older commit without that file will not test this fix.

Cloudflare installs the locked npm dependencies, runs the finite production build, and then uploads `dist`. The successful build log should report `Validated ... HTML pages` and proceed to Wrangler deployment; it should not say `Watching` or start a localhost server.

If build watch paths have been restricted, include content, media, templates, code, styles, configuration, package files, and public assets. The default all-files behavior requires no change. Automatic builds must remain enabled for CMS commits to publish.

## Static asset configuration

- Worker: `slp-website`.
- Assets: `./dist`.
- HTML handling: `auto-trailing-slash`, matching generated `directory/index.html` pages.
- Missing files: `404-page`, using the existing `404.html`.
- Redirects and security headers: `_redirects` and `_headers` are copied into `dist`.
- Worker JavaScript entry point, database bindings, and runtime variables: none required.
- Custom domain/routes: retain the existing dashboard configuration for `starchlinuxproject.org`. Its exact route configuration was not present in the log or repository; the new Wrangler file does not declare replacement routes.

## Domain and DNS

**No additional DNS record is required because `/wiki/` is served by the existing `starchlinuxproject.org` deployment.** Keep the current custom domain and DNS records. No wiki subdomain or additional route is needed.

## Cloudflare Pages settings

Not applicable to the deployment shown in the log. Pages CMS is the editing service; it does not require Cloudflare Pages hosting.

## Pages CMS

Use https://app.pagescms.org with access to the website repository and its production branch. The wiki starts with a homepage and no preset articles or categories. Add a category, then an article; public navigation is generated from that content.

- Articles: `content/wiki/`.
- Categories: `content/wiki-categories/`.
- Homepage: `content/wiki-home.md`.
- Image uploads: `public/wiki/images/`, published under `/wiki/images/`.

See [WIKI-EDITING.md](WIKI-EDITING.md) for the field contract and editing instructions. Keep any CMS-managed configuration aligned with these paths. No CMS configuration changes are needed to fix the deployment timeout.

## Secrets

No secrets belong in this repository. Workers Builds uses its managed Cloudflare deployment credentials; the existing authentication setup did not cause the supplied timeout. Pages CMS uses the owner's GitHub App authorization. No additional secret is required for this fix.

## Validation

Local checks:

```sh
npm ci
npm run build
npm test
npx wrangler deploy --dry-run
```

The dry run validates deployment configuration without uploading or publishing. The normal build must finish before Wrangler is invoked.

After deployment:

1. Verify `/`, `/download/`, `/community/`, `/extras/`, `/projects/`, `/wiki`, `/wiki/`, and a nonexistent URL.
2. Add an article and image through Pages CMS. Confirm the GitHub commit automatically triggers a Workers build and the page/image appear on the existing domain.
3. Edit the article's title, section, and order; check that its URL stays stable and navigation updates. Check rich-text formatting after saving and reopening.
4. Delete the test article and remove any links to it. Confirm its old URL returns 404 after the next deployment.

These authenticated CMS/deployment checks require the owner's accounts. If branch protection requires a pull request, its merge is also required before changes reach production.

## References

- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
- [Static asset HTML handling](https://developers.cloudflare.com/workers/static-assets/routing/advanced/html-handling/)
- [Static site 404 handling](https://developers.cloudflare.com/workers/static-assets/routing/static-site-generation/)
