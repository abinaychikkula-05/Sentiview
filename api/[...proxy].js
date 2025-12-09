const ALLOWED_METHODS = 'GET,POST,PUT,DELETE,PATCH,OPTIONS';

const getRawBody = (req) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
};

const sanitizeHeaders = (headers = {}) => {
  const sanitized = {};
  for (const [key, value] of Object.entries(headers)) {
    if (!value) continue;
    const lowerKey = key.toLowerCase();
    if (lowerKey === 'host' || lowerKey === 'connection' || lowerKey === 'content-length') {
      continue;
    }
    sanitized[key] = value;
  }
  // Ensure JSON requests always include content-type
  if (!sanitized['Content-Type'] && sanitized['content-type']) {
    sanitized['Content-Type'] = sanitized['content-type'];
  }
  return sanitized;
};

module.exports = async (req, res) => {
  const origin = req.headers.origin || '*';

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', ALLOWED_METHODS);
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type, Authorization');
    res.statusCode = 200;
    return res.end();
  }

  try {
    const { proxy = [], ...query } = req.query;
    const pathSegments = Array.isArray(proxy) ? proxy : [proxy];
    const targetPath = pathSegments.join('/');

    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else if (value !== undefined) {
        searchParams.append(key, value);
      }
    }

    const queryString = searchParams.toString();
    const targetUrl = `https://airy-tranquility-production-da57.up.railway.app/api/${targetPath}${queryString ? `?${queryString}` : ''}`;

    const headers = sanitizeHeaders(req.headers);
    const init = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const bodyBuffer = await getRawBody(req);
      if (bodyBuffer.length > 0) {
        init.body = bodyBuffer;
      }
    }

    const response = await fetch(targetUrl, init);
    const responseBody = await response.arrayBuffer();

    res.statusCode = response.status;
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'content-encoding') {
        return;
      }
      res.setHeader(key, value);
    });

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    res.end(Buffer.from(responseBody));
  } catch (error) {
    console.error('Proxy error:', error);
    res.statusCode = 500;
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.end(JSON.stringify({ success: false, message: 'Proxy request failed' }));
  }
};
