const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/index.html',
  '/style.css',
  '/app.js',
  '/about.html',
  '/blog.html',
  '/contact.html',
  '/portfolio-example01.html',
];

// Menginstall service worker dan melakukan caching pada file-file yang diperlukan
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          console.log('Opened cache');
          return cache.addAll(urlsToCache);
        })
    );
  });
  
self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Mengembalikan data dari cache jika ada
        if (response) {
          return response;
        }
  
        // Jika tidak ada di cache, maka ambil dari network
        return fetch(event.request).then((response) => {
          // Simpan data response dari network ke dalam cache
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
    );
  });
  
//cache offline
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function(res) {
                return caches.open('first-app')
                  .then(function(cache) {
                    return fetch(event.request)
                    .then(function(res){
  
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
            })
              .catch(function(err) {
                return caches.open('first-app')
                  .then(function(cache) {
                    return fetch(event.request)
                    .then(function(res){
  
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
                  });
              });
          }
        })
    );
  });


  // Membersihkan cache yang sudah tidak digunakan lagi
  self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName !== CACHE_NAME;
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });


