importScripts('js/sw-utils.js');

const STATIC_CACHE    = 'static-v1';
const DINAMIC_CACHE   = 'dinamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];
const APP_SHELL_INMUTABLE = [
    'css/animate.css',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'js/libs/jquery.js'
];

self.addEventListener('install',e => {
    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => {
            cache.addAll(APP_SHELL);
        });
    
    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => {
            cache.addAll(APP_SHELL_INMUTABLE);
        });
    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));
});

self.addEventListener('activate',e => {
    const cleanStatic = caches.keys().then(keys => {
        keys.forEach((key) => {
            if(key !== STATIC_CACHE && key.includes('static'))
            {
                return caches.delete(key);
            }
            if(key !== STATIC_CACHE && key.includes('dynamic'))
            {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(cleanStatic);
});

self.addEventListener('fetch',e => {
    const resource = caches.match(e.request)
        .then(response => {
            if(response)
            {
                return response;
            }
            console.log('Resource not found in cache ',e.request.url);
            return fetch(e.request)
                .then(newResource => {
                    return updateCacheDynamic(DINAMIC_CACHE,e.request,newResource);
                });
        });
    e.respondWith(resource);
});