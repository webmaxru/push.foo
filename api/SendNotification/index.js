const utils = require('../Shared/utils');
const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;
const webPush = require('web-push');

const defaultNotification = {
  title: 'Default title',
  actions: [
    {
      action: 'action_default',
      title: 'Default action',
    },
  ],
  body: 'Default text',
  dir: 'auto',
  icon: 'https://push.foo/images/icons/android-chrome-192x192.png',
  badge: 'https://push.foo/images/icons/android-chrome-192x192.png',
  lang: 'en-US',
  renotify: true,
  requireInteraction: true,
  tag: 'tag',
  vibrate: [300, 100, 400],
};

module.exports = async function (context, req) {
  let operationIdOverride = utils.getOperationIdOverride(context);

  if (!req.body || !('pushSubscription' in req.body)) {
    client.trackException({
      exception: new Error('No required parameter!'),
      tagOverrides: operationIdOverride,
    });

    context.res = { status: 404, body: 'No required parameter!' };
    context.done();
  }

  webPush.setVapidDetails(
    'mailto:salnikov@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  let pushSubscription = req.body.pushSubscription;
  let notification = req.body.notification || defaultNotification;

  context.log('pushSubscription:');
  context.log(pushSubscription);

  context.log('notification:');
  context.log(notification);

  let clientPrincipal = utils.getClientPrincipal(req);

  await webPush
    .sendNotification(pushSubscription, JSON.stringify(notification))
    .then((response) => {
      context.log('Push sent');
      context.log(response);

      client.trackEvent({
        name: 'notification_send_success',
        tagOverrides: operationIdOverride,
        properties: {
          pushSubscription: pushSubscription,
        },
      });

      context.res = {
        body: {
          message: 'notification_send_success',
          pushSubscription: pushSubscription,
          notification: notification,
          response: response
        },
      };
    })
    .catch((error) => {
      context.log('Push error');
      context.log(error)

      client.trackEvent({
        name: 'notification_send_error',
        tagOverrides: operationIdOverride,
        properties: {
          pushSubscription: pushSubscription,
          notification: notification,
          error: error,
        },
      });

      context.res = {
        body: {
          message: 'notification_send_error',
          error: error,
        },
      };
    });
};
