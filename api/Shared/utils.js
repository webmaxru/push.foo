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
  // https://stackoverflow.com/a/52171480/1310228
  for (var i = 0, h = 9; i < s.length; )
    h = Math.imul(h ^ s.charCodeAt(i++), 9 ** 9);
  return (h ^ (h >>> 9)).toString(16);
};

module.exports = {
  getClientPrincipal,
  getOperationIdOverride,
  getEndpointHash,
};
