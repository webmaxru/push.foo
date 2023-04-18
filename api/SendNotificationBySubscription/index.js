const utils = require('../Shared/utils');
const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;
const webPush = require('web-push');

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
  let notification = req.body.notification || utils.defaultNotification;

  context.log('pushSubscription:',pushSubscription);
  context.log('notification:',notification);

  await webPush
    .sendNotification(pushSubscription, JSON.stringify(notification))
    .then((response) => {
      context.log('Push sent. Response:',response);

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
          notification: notification
        },
      };
    })
    .catch((error) => {
      context.log('Push send error:', error);

      client.trackException({
        exception: new Error(error),
        tagOverrides: operationIdOverride,
        properties: {
          pushSubscription: pushSubscription
        },
      });

      context.res = {
        body: {
          message: 'notification_send_error',
          pushSubscription: pushSubscription,
          notification: notification
        },
      };
    });
};
