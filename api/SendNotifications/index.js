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
    !(
      ('subscriptionIds' in req.body &&
        Array.isArray(req.body.subscriptionIds) &&
        req.body.subscriptionIds.length) ||
      'tag' in req.body
    )
  ) {
    client.trackException({
      exception: new Error('No required parameter!'),
      tagOverrides: operationIdOverride,
    });

    context.res = { status: 404, body: 'No required parameter!' };
    context.done();
  }

  const sendLimit = 5; // Max 5 subscriptions

  const dbClient = new CosmosClient(process.env.pushfoodbaccount_DOCUMENTDB);
  const { database } = await dbClient.databases.createIfNotExists({
    id: 'push-foo-db',
  });
  const { container } = await database.containers.createIfNotExists({
    id: 'subscriptions',
  });

  let notification = req.body.notification || utils.defaultNotification;
  context.log('notification:', notification);

  let subscriptionIds = req.body.subscriptionIds || [];
  context.log('Number of subscriptions:', subscriptionIds.length);

  tag = req.body.tag || null;
  context.log('tag:', tag);

  webPush.setVapidDetails(
    'mailto:salnikov@gmail.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );

  let queryParams = [];
  let query = 'SELECT * from c WHERE ';
  let queryWhereParts = [];

  if (subscriptionIds.length) {
    let i = 0;
    queryParams = subscriptionIds.map((id) => {
      i++;

      return {
        name: '@subscriptionId' + i,
        value: id,
      };
    });

    let subscriptionIdsParamNames = queryParams
      .map((param) => param.name)
      .join();

    queryWhereParts.push(`c.id IN (${subscriptionIdsParamNames})`);
  }

  if (tag) {
    queryParams.push({
      name: '@tag',
      value: tag,
    });

    queryWhereParts.push(`ARRAY_CONTAINS(c.tags,@tag)`);
  }

  query +=
    queryWhereParts.join(' OR ') +
    ' ORDER BY c.timestamp DESC OFFSET 0 LIMIT ' +
    sendLimit;

  let paramQuery = {
    query: query,
    parameters: [...queryParams],
  };

  context.log('paramQuery:', paramQuery);

  const { resources } = await container.items.query(paramQuery).fetchAll();

  context.log('resources count:', resources.length);

  let promiseStack = [];
  let sentSubscriptionIds = [];

  class ReadableError extends Error {
    toJSON() {
      return JSON.stringify({
        message: this.message,
      });
    }
  }

  for (const subscription of resources) {
    let pushSubscription = subscription.pushSubscription;

    context.log('pushSubscription:', pushSubscription);

    sentSubscriptionIds.push(subscription.id);

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

          return subscription.id;
        })
        .catch((error) => {
          context.log('Push send error:', error);

          client.trackException({
            exception: new Error(error),
            tagOverrides: operationIdOverride,
            properties: {
              pushSubscription: pushSubscription,
            },
          });

          return Promise.reject(
            new ReadableError(subscription.id + ': ' + error)
          );
        })
    );
  }

  await Promise.allSettled(promiseStack).then((results) => {
    const fulfilled = results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value);

    const rejected = results
      .filter((result) => result.status === 'rejected')
      .map((result) => {
        return result.reason.message;
      });

    context.res = {
      body: {
        message: 'notifications_send_complete',
        subscriptionIds: subscriptionIds,
        sentSubscriptionIds: sentSubscriptionIds,
        sendSuccess: fulfilled,
        sendError: rejected,
        tag: tag,
        notification: notification,
      },
    };
  });
};
