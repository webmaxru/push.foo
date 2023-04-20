/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { setCacheNameDetails, clientsClaim } from 'workbox-core';
import { NetworkFirst } from 'workbox-strategies';
import { googleFontsCache } from 'workbox-recipes';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import * as googleAnalytics from 'workbox-google-analytics';

async function messageClient(event, messageType) {
  console.log('[Service Worker]: Sending message to app', messageType);

  let message = {
    type: messageType,
  };

  if (!event.clientId) {
    const clients = await self.clients.matchAll({ type: 'window' });
    for (const client of clients) {
      client.postMessage(message);
      console.log('[Service Worker]: Sent message to app', client);
    }
  } else {
    const client = await clients.get(event.clientId);
    if (!client) return;

    client.postMessage(message);
    console.log('[Service Worker]: Sent message to app', client);
  }
}

// SETTINGS

// Claiming control to start runtime caching asap
clientsClaim();

// Use to update the app after user triggered refresh
//self.skipWaiting();

// Setting custom cache names
setCacheNameDetails({ precache: 'wb6-precache', runtime: 'wb6-runtime' });

// PRECACHING

// Precache and serve resources from __WB_MANIFEST array
// precacheAndRoute(self.__WB_MANIFEST);

// NAVIGATION ROUTING

// This assumes /index.html has been precached.
/*
const navHandler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(navHandler, {
  denylist: [
    new RegExp('/account'),
    new RegExp('/admin'),
    new RegExp('/login'),
    new RegExp('/logout'),
    new RegExp('/.auth'),
    new RegExp('/aboutme'),
    new RegExp('/400.html'),
    new RegExp('/404.html'),
    new RegExp('/privacy.html'),
  ], // Also might be specified explicitly via allowlist
});
registerRoute(navigationRoute);
*/
// STATIC RESOURCES

googleFontsCache({ cachePrefix: 'wb6-gfonts' });

// APP SHELL UPDATE FLOW

addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ALL OTHER EVENTS

// Receive push and show a notification
self.addEventListener('push', (event) => {
  console.log('[Service Worker]: Received push event', event);

  let notificationData = {};

  try {
    notificationData = event.data.json();
  } catch (error) {
    console.error('[Service Worker]: Error parsing notification data', error);
    notificationData = {
      title: 'No data from server',
      message: 'Displaying default notification',
      icon: 'https://push.foo/images/logo.jpg',
      badge: 'https://push.foo/images/logo-mask.png',
    };
  }

  console.log('[Service Worker]: notificationData', notificationData);

  const messageClientPromise = messageClient(event, 'NOTIFICATION_RECEIVED');

  const showNotificationPromise = self.registration.showNotification(
    notificationData.title,
    notificationData
  );
  const promiseChain = Promise.all([messageClientPromise,showNotificationPromise]);

  event.waitUntil(promiseChain);
});

// Custom notification actions
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker]: Received notificationclick event');

  event.notification.close();

  if (event.action == 'open_project_repo') {
    console.log('[Service Worker]: Performing action open_project_repo');

    event.waitUntil(
      clients.openWindow('https://github.com/webmaxru/push.foo').then( (windowClient) => {
        console.log('[Service Worker]: Opened window', windowClient);
      })
    );
  } else {
    console.log('[Service Worker]: Performing default click action');

    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
      clients
        .matchAll({
          includeUncontrolled: true,
          type: 'window',
        })
        .then(function (clientList) {
          for (var i = 0; i < clientList.length; i++) {
            var client = clientList[i];
            if (client.url == '/' && 'focus' in client) return client.focus();
          }
          if (clients.openWindow) return clients.openWindow('/');
        })
    );
  }
});

// Closing notification action
self.addEventListener('notificationclose', (event) => {
  log('[Service Worker]: Received notificationclose event');
});

googleAnalytics.initialize();
