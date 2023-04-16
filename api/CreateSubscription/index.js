const utils = require('../Shared/utils');
const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;

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

  let clientPrincipal = utils.getClientPrincipal(req);

  const timestamp = Math.floor(Date.now() / 1);
  const id = utils.getEndpointHash(req.body.pushSubscription.endpoint);

  context.bindings.outputDocument = JSON.stringify({
    id: id,
    timestamp: timestamp,
    pushSubscription: req.body.pushSubscription
  });

  client.trackEvent({
    name: 'subscription_create_success',
    tagOverrides: operationIdOverride,
    properties: {
      id: id,
      timestamp: timestamp,
    },
  });

  context.res = {
    body: {
      message: 'subscription_create_success',
      clientPrincipal: clientPrincipal,
      id: id,
    },
  };
};
