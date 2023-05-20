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
  var hash = 0,
    i = 0,
    len = s.length;
  while (i < len) {
    hash = ((hash << 5) - hash + s.charCodeAt(i++)) << 0;
  }
  return (hash + 2147483647 + 1).toString(16);
};

const defaultNotification = {
  title: 'Test Notification Title',
  actions: [
    {
      action: 'open_project_repo',
      title: 'Show source code',
    },
    {
      action: 'open_author_twitter',
      title: 'Author on Twitter',
    },
    {
      action: 'open_author_linkedin',
      title: 'Author on LinkedIn',
    },
    {
      action: 'open_url',
      title: 'Open custom URL',
    },
  ],
  body: 'Test notification body',
  dir: 'auto',
  image: 'https://push.foo/images/social.png',
  icon: 'https://push.foo/images/logo.jpg',
  badge: 'https://push.foo/images/logo-mask.png',
  lang: 'en-US',
  renotify: 'true',
  requireInteraction: 'true',
  tag: 'tag',
  vibrate: [300, 100, 400],
  data: {
    dateOfArrival: Date.now(),
    updateInAppCounter: true,
    updateIconBadgeCounter: true,
    author: {
      name: 'Maxim Salnikov',
      github: 'https://github.com/webmaxru',
      twitter: 'https://twitter.com/webmaxru',
      linkedin: 'https://www.linkedin.com/in/webmax/',
    },
    project: {
      github: 'https://github.com/webmaxru/push.foo',
    },
    action: {
      url: 'https://push.foo',
    },
  },
};

module.exports = {
  getClientPrincipal,
  getOperationIdOverride,
  getEndpointHash,
  defaultNotification,
};
