// Antigravity 2.0 IDE Local Connected Backend
const http = require('http');
const { spawn } = require('child_process');
const WebSocket = require('ws');

const PORT = 8081;
const HOST = '127.0.0.1'; // Binds STRICTLY to localhost for security

// 1. Create HTTP Server (for health checking and browser proxies)
const server = http.createServer(async (req, res) => {
  // Set CORS headers so the local IDE frontend can talk to us
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // Health Check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'active', platform: process.platform }));
    return;
  }

  // CORS-Free Browser Proxy (Takes over internet requests on behalf of the browser)
  if (url.pathname === '/proxy') {
    const targetUrl = url.searchParams.get('url');
    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing "url" parameter.');
      return;
    }

    try {
      console.log(`[Proxy] Fetching: ${targetUrl}`);
      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const contentType = response.headers.get('content-type') || 'text/html';
      
      if (contentType.includes('text/html')) {
        let text = await response.text();
        const targetBase = new URL(targetUrl);
        
        // Rewrite root-relative links/sources (e.g. href="/about" -> href="origin/about")
        text = text.replace(/(href|src)="\/([^"]*)"/g, (match, attr, path) => {
          return `${attr}="${targetBase.origin}/${path}"`;
        });
        
        // Rewrite protocol-relative links (e.g. href="//cdn.com" -> href="https://cdn.com")
        text = text.replace(/(href|src)="\/\/([^"]*)"/g, `$1="https://$2"`);
        
        res.writeHead(response.status, { 'Content-Type': contentType });
        res.end(text);
      } else {
        const buffer = await response.arrayBuffer();
        res.writeHead(response.status, { 'Content-Type': contentType });
        res.end(Buffer.from(buffer));
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Proxy fetch failed: ${err.message}`);
    }
    return;
  }

  // Not Found
  res.writeHead(404);
  res.end('Not Found');
});

// 2. Initialize WebSocket Server for interactive terminal
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  const origin = req.headers.origin || '';
  console.log(`[WS] Client connected from origin: ${origin}`);

  // Security Check: Verify origin is local to prevent external website hijack
  if (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1') && !origin.startsWith('file://')) {
    console.log(`[WS] Rejected unauthorized origin connection: ${origin}`);
    ws.close(4001, 'Unauthorized Origin');
    return;
  }

  // Spawn standard interactive bash shell
  // We use standard bash, executing in the active workspace
  const shell = spawn('bash', ['-i'], {
    cwd: __dirname,
    env: { ...process.env, PAGER: 'cat' } // Force pager to cat so git/man commands don't freeze
  });

  // Handle shell stdout
  shell.stdout.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
    }
  });

  // Handle shell stderr
  shell.stderr.on('data', (data) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'output', data: data.toString() }));
    }
  });

  // Handle shell exit
  shell.on('close', (code) => {
    console.log(`[WS] Shell sub-process exited with code ${code}`);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'exit', code }));
      ws.close();
    }
  });

  // Handle WebSocket messages (input from the web frontend)
  ws.on('message', (message) => {
    try {
      const payload = JSON.parse(message);
      if (payload.type === 'input') {
        shell.stdin.write(payload.data);
      }
    } catch (err) {
      console.error('[WS] Failed parsing client message:', err);
    }
  });

  // Handle WebSocket closes
  ws.on('close', () => {
    console.log('[WS] Client disconnected. Terminating shell...');
    shell.kill('SIGINT');
  });

  // Handle errors
  ws.on('error', (err) => {
    console.error('[WS] Socket error:', err);
    shell.kill();
  });
});

// Handle server startup errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n[Info] Antigravity backend is already running on port ${PORT}.`);
    console.log(`Connecting to existing instance...`);
    process.exit(0);
  } else {
    console.error(`[Server Error]`, err);
    process.exit(1);
  }
});

// Start Server listening strictly on loopback interface
server.listen(PORT, HOST, () => {
  console.log(`=================================================`);
  console.log(`🌌 Antigravity 2.0 IDE Backend Server Running!`);
  console.log(`URL: http://${HOST}:${PORT}`);
  console.log(`WebSocket: ws://${HOST}:${PORT}`);
  console.log(`Local terminal integration active and secured.`);
  console.log(`=================================================`);
});
