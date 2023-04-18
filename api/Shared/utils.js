const getClientPrincipal = (req) => {
  try {
    const header = req.headers['x-ms-client-principal'];
    const encoded = Buffer.from(header, 'base64');
    const decoded = encoded.toString('ascii');
    return JSON.parse(decoded);
  } catch (error) {
    return {};
  }
};

const getOperationIdOverride = (context) => {
  return {
    'ai.operation.id': context.traceContext.traceparent,
  };
};


const getEndpointHash = (s) => {
    // https://stackoverflow.com/a/33647870/1310228
    var hash = 0, i = 0, len = s.length;
    while ( i < len ) {
        hash  = ((hash << 5) - hash + s.charCodeAt(i++)) << 0;
    }
    return (hash + 2147483647 + 1).toString(16);
}

const getEndpointHashAlt = (s) => {
  // https://stackoverflow.com/a/52171480/1310228
  for (var i = 0, h = 9; i < s.length; )
    h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
  return (h ^ (h >>> 9)).toString(16);
};

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
    icon: 'https://push.foo/images/logo.png',
    badge: 'https://push.foo/images/logo.jpg',
    lang: 'en-US',
    renotify: true,
    requireInteraction: true,
    tag: 'tag',
    vibrate: [300, 100, 400],
  };

module.exports = {
  getClientPrincipal,
  getOperationIdOverride,
  getEndpointHash,
  defaultNotification
};
