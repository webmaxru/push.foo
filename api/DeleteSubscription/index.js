const utils = require('../Shared/utils');
const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;
const webPush = require('web-push');
const { CosmosClient } = require('@azure/cosmos');

module.exports = async function (context, req) {
  let operationIdOverride = utils.getOperationIdOverride(context);

  if (!req.query.subscriptionId) {
    client.trackException({
      exception: new Error('No required parameter!'),
      tagOverrides: operationIdOverride,
    });

    context.res = { status: 404, body: 'No required parameter!' };
    context.done();
  }

  subscriptionId = req.query.subscriptionId;
  context.log('subscriptionId', subscriptionId);

  const dbClient = new CosmosClient(process.env.pushfoodbaccount_DOCUMENTDB);
  const { database } = await dbClient.databases.createIfNotExists({
    id: 'push-foo-db',
  });
  const { container } = await database.containers.createIfNotExists({
    id: 'subscriptions',
  });

  // const { resource: readDoc } = await item.read();
  
  try {
    await container.item(subscriptionId, subscriptionId).delete();

    client.trackEvent({
      name: 'subscription_delete_success',
      tagOverrides: operationIdOverride,
      properties: {
        subscriptionId: subscriptionId,
      },
    });

    context.res = {
      body: {
        message: 'subscription_delete_success',
        subscriptionId: subscriptionId,
      },
    };
  } catch (error) {
    context.log('Subscription delete error:', error);

    client.trackException({
      exception: new Error(error),
      tagOverrides: operationIdOverride,
      properties: {
        subscriptionId: subscriptionId,
      },
    });

    context.res = {
      body: {
        message: 'subscription_delete_error',
        subscriptionId: subscriptionId,
      },
    };
  }
};
