export default function (config) {
  config.addFilter('publicationDate', value => new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`)));
  // Only explicitly public assets are copied. Content and development files stay private.
  for (const path of [
    'index.html', '404.html', 'download', 'community', 'extras', 'projects', 'css', 'js',
    'about-seth', 'LUU-license', '_headers', '_redirects', 'starch-license.txt',
    'starch-logo-license', 'starchlinux_v2.png', 'starch-fastfetch.png',
    'starch-desktop-evergreen.png', 'linux-update-utility.png',
    'luu-icon.svg', 'discord-symbol.svg', 'Coyol-round.PNG',
  ]) config.addPassthroughCopy(path);
  config.addPassthroughCopy({ 'public/wiki/images': 'wiki/images' });
  config.addWatchTarget('content/');
  config.addWatchTarget('lib/');
  return {
    dir: { input: 'src', output: 'dist' },
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: false,
  };
}
