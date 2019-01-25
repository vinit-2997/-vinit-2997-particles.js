
const staticAssets = [
    './',
    './demo/css/style.css',
    './particles.js',
    './particles.min.js'
    './demo/js/app.js',
    './demo/particles.json',
    './demo/js/lib/stats.js'
];

self.addEventListener('install', async event => {
    const cache = await caches.open('static-def');
    cache.addAll(staticAssets);
});

