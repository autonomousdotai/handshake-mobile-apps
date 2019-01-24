/* eslint-env serviceworker */
/* eslint no-restricted-globals: 1 */
/* global firebase */

importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp(process.env.firebase);

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.body,
  };
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});

