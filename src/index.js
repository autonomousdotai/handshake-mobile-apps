import React from 'react';
import ReactDOM from 'react-dom';

// components
import Website from '@/components/App/Basic';
// import registerServiceWorker from '@/services/worker';
import * as OfflinePlugin from 'offline-plugin/runtime';

// registerServiceWorker();

if (process.env.caches) {
  OfflinePlugin.install({
    onUpdateReady() {
      OfflinePlugin.applyUpdate();
    },
    onUpdated() {
      window.location.reload();
    },
  });
} else {
  if (window.caches) {
    window.caches
      .keys()
      .then(keyList => Promise.all(keyList.map(key => window.caches.delete(key))));
  }
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((sw) => {
        if (/\/sw.js$/.test(sw.active.scriptURL)) {
          sw.unregister();
        }
      });
    });
  }
}

ReactDOM.render(<Website />, document.getElementById('app'));
const root = document.getElementById('root');
if (root) root.addEventListener('contextmenu', e => e.preventDefault());
