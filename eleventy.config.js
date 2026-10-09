export default function (config) {
  // Only explicitly public assets are copied. Content and development files stay private.
  for (const path of [
    'index.html', '404.html', 'download', 'community', 'extras', 'projects', 'css', 'js',
    'about-seth', 'LUU-license', '_headers', '_redirects', 'starch-license.txt',
    'starch-logo-license', 'starchlinux_v2.png', 'starch-fastfetch.png',
    'starch-desktop-evergreen.png', 'linux-update-utility.png',
    'luu-icon.svg', 'discord-symbol.svg',
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
