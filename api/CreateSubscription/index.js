const utils = require('../Shared/utils');
const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;

module.exports = async function (context, req) {
  let operationIdOverride = utils.getOperationIdOverride(context);

  if (!req.body || !req.body.pushSubscription) {
    client.trackException({
      exception: new Error('No required parameter!'),
      tagOverrides: operationIdOverride,
    });

    context.res = { status: 404, body: 'No required parameter!' };
    context.done();
  }

  let tags = req.body.tags || [];
  let pushSubscription = req.body.pushSubscription;

  let clientPrincipal = utils.getClientPrincipal(req);

  const timestamp = Math.floor(Date.now() / 1);
  const subscriptionId = utils.getEndpointHash(pushSubscription.endpoint);

  try {
    context.bindings.outputDocument = JSON.stringify({
      id: subscriptionId,
      timestamp: timestamp,
      pushSubscription: pushSubscription,
      tags: tags,
    });

    client.trackEvent({
      name: 'subscription_create_success',
      tagOverrides: operationIdOverride,
      properties: {
        subscriptionId: subscriptionId,
        timestamp: timestamp,
        pushSubscription: pushSubscription,
        tags: tags,
      },
    });

    context.res = {
      body: {
        message: 'subscription_create_success',
        subscriptionId: subscriptionId,
        pushSubscription: pushSubscription,
        tags: tags,
      },
    };
  } catch (error) {
    context.log('Subscription create error:', error);

    client.trackException({
      exception: new Error(error),
      tagOverrides: operationIdOverride,
      properties: {
        subscriptionId: subscriptionId,
        pushSubscription: pushSubscription,
        tags: tags,
      },
    });

    context.res = {
      body: {
        message: 'subscription_create_error',
        subscriptionId: subscriptionId,
        pushSubscription: pushSubscription,
        tags: tags,
      },
    };
  }
};
