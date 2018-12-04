import React from 'react';
import ReactDOM from 'react-dom';
import { getGasPrice } from '@/utils/gasPrice.js';
// components
import App from '@/components/App/App';
import * as OfflinePlugin from 'offline-plugin/runtime';

window.gasPrice = 64;
getGasPrice();

if (process.env.caches) {
  OfflinePlugin.install({
    onUpdateReady() {
      OfflinePlugin.applyUpdate();
    },
    onUpdated() {
      window.location.reload();
    }
  });
} else {
  if (window.caches) {
    window.caches
      .keys()
      .then(keyList =>
        Promise.all(keyList.map(key => window.caches.delete(key)))
      );
  }
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(sw => {
        if (/\/sw.js$/.test(sw.active.scriptURL)) {
          sw.unregister();
        }
      });
    });
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
const root = document.getElementById('root');
if (root) root.addEventListener('contextmenu', e => e.preventDefault());
