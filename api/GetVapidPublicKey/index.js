const utils = require('../Shared/utils');
const appInsights = require('applicationinsights');
appInsights.setup();
const client = appInsights.defaultClient;

module.exports = async function (context, req) {
  let operationIdOverride = utils.getOperationIdOverride(context);

  client.trackEvent({
    name: 'get_vapid-public-key_success',
    tagOverrides: operationIdOverride,
    'vapid-public-key': process.env.VAPID_PUBLIC_KEY,
  });

  context.res = {
    body: {
      message: 'get_vapid-public-key_success',
      'vapid-public-key': process.env.VAPID_PUBLIC_KEY,
    },
  };
};
