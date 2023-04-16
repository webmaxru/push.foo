const utils = require('../Shared/utils');
const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;
const webPush = require('web-push');
const { CosmosClient } = require('@azure/cosmos');

module.exports = async function (context, req) {
  let operationIdOverride = utils.getOperationIdOverride(context);

  if (
    !req.body ||
    !('subscriptionIds' in req.body) ||
    !Array.isArray(req.body.subscriptionIds) ||
    !req.body.subscriptionIds.length
  ) {
    client.trackException({
      exception: new Error('No required parameter!'),
      tagOverrides: operationIdOverride,
    });

    context.res = { status: 404, body: 'No required parameter!' };
    context.done();
  }

  tag = req.body.tag || null;

  const dbClient = new CosmosClient(process.env.pushfoodbaccount_DOCUMENTDB);
  const { database } = await dbClient.databases.createIfNotExists({
    id: 'push-foo-db',
  });
  const { container } = await database.containers.createIfNotExists({
    id: 'subscriptions',
  });

  let notification = req.body.notification || utils.defaultNotification;
  context.log('notification:', notification);

  let subscriptionIds = req.body.subscriptionIds.slice(0, 5); // Max 5 subscriptions
  context.log('Number of subscriptions:', subscriptionIds.length);

  webPush.setVapidDetails(
    'mailto:salnikov@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  let i = 0;

  let queryParams = subscriptionIds.map((id) => {
    i++;

    return {
      name: '@subscriptionId' + i,
      value: id,
    };
  });

  let subscriptionIdsParamNames = queryParams
    .map((param) => {
      return param.name;
    })
    .join();

  let query = `SELECT * from c WHERE c.id IN (${subscriptionIdsParamNames})`;

  if (tag) {
    query += ' AND ARRAY_CONTAINS(c.tags,@tag)';
    queryParams.push({
      name: '@tag',
      value: tag,
    });
  }

  let paramQuery = {
    query: query,
    parameters: [...queryParams],
  };

  context.log('paramQuery:', paramQuery);

  const { resources } = await container.items.query(paramQuery).fetchAll();

  context.log('resources count:', resources.length);

  let promiseStack = [];

  for (const subscription of resources) {
    let pushSubscription = subscription.pushSubscription;

    context.log('pushSubscription:', pushSubscription);

    promiseStack.push(
      webPush
        .sendNotification(pushSubscription, JSON.stringify(notification))
        .then((response) => {
          context.log('Push sent. Response:', response);

          client.trackEvent({
            name: 'notification_send_success',
            tagOverrides: operationIdOverride,
            properties: {
              pushSubscription: pushSubscription,
            },
          });
        })
        .catch((error) => {
          context.log('Push send error:', error);

          client.trackEvent({
            name: 'notification_send_error',
            tagOverrides: operationIdOverride,
            properties: {
              pushSubscription: pushSubscription,
              error: error,
            },
          });
        })
    );
  }

  await Promise.allSettled(promiseStack).then((results) => {
    context.res = {
      body: {
        message: 'notifications_send_success',
        subscriptionIds: subscriptionIds,
        notification: notification,
      },
    };
  });
};
