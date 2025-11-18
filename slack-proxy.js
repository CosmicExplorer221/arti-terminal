// Simple proxy server for Slack webhook
// This bypasses CORS restrictions

const http = require('http');
const https = require('https');

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || 'YOUR_WEBHOOK_URL_HERE';
const PORT = 3001;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Only accept POST to /slack
  if (req.method === 'POST' && req.url === '/slack') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      // Forward to Slack
      const url = new URL(SLACK_WEBHOOK_URL);
      const options = {
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxyReq = https.request(options, (proxyRes) => {
        let data = '';

        proxyRes.on('data', chunk => {
          data += chunk;
        });

        proxyRes.on('end', () => {
          res.writeHead(proxyRes.statusCode, { 'Content-Type': 'text/plain' });
          res.end(data);
        });
      });

      proxyReq.on('error', (error) => {
        console.error('Error forwarding to Slack:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to send to Slack' }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Slack proxy server running on http://localhost:${PORT}`);
  console.log(`Forwarding requests to: ${SLACK_WEBHOOK_URL}`);
});
