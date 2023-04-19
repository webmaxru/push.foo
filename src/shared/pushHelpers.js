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

export const defaultNotification = {
  title: 'Push.Foo Notification Title',
  actions: [
    {
      action: 'action_custom',
      title: 'Custom action',
    },
  ],
  body: 'Test notification body',
  dir: 'auto',
  image: 'https://push.foo/images/social.png',
  icon: 'https://push.foo/images/logo.jpg',
  badge: 'https://push.foo/images/logo-mask.png',
  lang: 'en-US',
  renotify: 'true',
  requireInteraction: 'true',
  tag: 'tag',
  vibrate: [300, 100, 400],
}

export default { urlBase64ToUint8Array, defaultNotification };
