export const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const subscribe = (vapidPublicKey, swScope) => {
  return navigator.serviceWorker
    .getRegistration(swScope)
    .then((registration) => {
      return registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        })
        .then((pushSubscription) => {
          return pushSubscription;
        })
        .catch((error) => {
          throw new Error(error);
        });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const unsubscribe = (swScope) => {
  return navigator.serviceWorker
    .getRegistration(swScope)
    .then((registration) => {
      registration.pushManager.getSubscription().then((pushSubscription) => {
        pushSubscription
          .unsubscribe()
          .then((success) => {
            return success;
          })
          .catch((error) => {
            throw new Error(error);
          });
      });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const getExistingSubscription = () => {
  return navigator.serviceWorker.ready
    .then((registration) => {
      return registration.pushManager
        .getSubscription()
        .then((pushSubscription) => {
          return pushSubscription;
        });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

export const defaultNotification = {
  title: 'Push.Foo Notification Title',
  actions: [
    {
      action: 'open_project_repo',
      title: 'Show source code',
    },
    {
      action: 'open_author_twitter',
      title: 'Author on Twitter',
    },
    {
      action: 'open_author_linkedin',
      title: 'Author on LinkedIn',
    },
    {
      action: 'open_url',
      title: 'Open custom URL',
    },
  ],
  body: 'Test notification body',
  dir: 'auto',
  image: 'https://push.foo/images/social.png',
  icon: 'https://push.foo/images/logo.jpg',
  badge: 'https://push.foo/images/logo-mask.png',
  lang: 'en-US',
  renotify: false,
  requireInteraction: true,
  silent: false,
  tag: 'Custom tag',
  timestamp: Date.now(),
  data: {
    dateOfArrival: Date.now(),
    updateInAppCounter: true,
    updateIconBadgeCounter: true,
    author: {
      name: 'Maxim Salnikov',
      github: 'https://github.com/webmaxru',
      twitter: 'https://twitter.com/webmaxru',
      linkedin: 'https://www.linkedin.com/in/webmax/',
    },
    project: {
      github: 'https://github.com/webmaxru/push.foo',
    },
    action: {
      url: 'https://push.foo',
    },
  },
};

export const buildNotification = (newValues) => {
  return Object.assign({}, defaultNotification, newValues);
};

export default {
  urlBase64ToUint8Array,
  defaultNotification,
  subscribe,
  unsubscribe,
  getExistingSubscription,
  buildNotification,
};
