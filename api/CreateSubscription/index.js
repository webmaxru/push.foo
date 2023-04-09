const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;
import { v5 as uuidv5 } from 'uuid';

module.exports = async function (context, req) {
  var operationIdOverride = {
    'ai.operation.id': context.traceContext.traceparent,
  };

  if (!req.body || !('subscriptionObject' in req.body) ) {
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

  context.bindings.outputDocument = JSON.stringify({
    id: uuidv5(req.body.subscriptionObject.endpoint, uuidv5.URL),
    timestamp: timestamp,
  });

  client.trackEvent({
    name: 'feedback_save',
    tagOverrides: operationIdOverride,
    properties: {
      timestamp: timestamp,
    },
  });

  context.res = {
    body: {
      message: 'Thank you!',
      clientPrincipal: clientPrincipal,
    },
  };
};
