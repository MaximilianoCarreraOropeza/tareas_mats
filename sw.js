const CACHE_NAME = 'pouchdb-cache-v1';

const FILES_TO_CACHE = [
    './',
    './index.html',
    './main.js',
    'https://cdn.jsdelivr.net/npm/pouchdb@9.0.0/dist/pouchdb.min.js',
    './styles.css',
    './images/icons/192.png',
    './images/icons/512.png',
    './manifest.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Archivos en caché:', FILES_TO_CACHE);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Eliminando caché antigua:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; 
                }
                return new Response('Recurso no disponible en caché', {
                    status: 404,
                    statusText: 'Not Found'
                });
            })
    );
});