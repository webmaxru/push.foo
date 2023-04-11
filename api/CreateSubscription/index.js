const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;
const { v5: uuidv5 } = require('uuid');

module.exports = async function (context, req) {
  var operationIdOverride = {
    'ai.operation.id': context.traceContext.traceparent,
  };

  if (!req.body || !('subscriptionObject' in req.body)) {
    client.trackException({
      exception: new Error('No required parameter!'),
      tagOverrides: operationIdOverride,
    });

    context.res = { status: 404, body: 'No required parameter!' };
    context.done();
  }

  let clientPrincipal = {};

  try {
    const header = req.headers['x-ms-client-principal'];
    const encoded = Buffer.from(header, 'base64');
    const decoded = encoded.toString('ascii');
    clientPrincipal = JSON.parse(decoded);
  } catch (err) {
    context.log(`${err.name}: ${err.message}`);
  }

  const timestamp = Math.floor(Date.now() / 1);
  const id = uuidv5(req.body.subscriptionObject.endpoint, uuidv5.URL);

  context.bindings.outputDocument = JSON.stringify({
    id: id,
    timestamp: timestamp,
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
