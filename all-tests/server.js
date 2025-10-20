#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;
    
    console.log(`📥 Request: ${pathname}`);
    
    // Remove leading slash
    if (pathname.startsWith('/')) {
        pathname = pathname.substring(1);
    }
    
    // Default to index.html for root
    if (pathname === '' || pathname === '/') {
        pathname = 'index.html';
    }
    
    // Handle directory requests - serve index.html
    if (pathname.endsWith('/')) {
        pathname = pathname + 'index.html';
    }
    
    const filePath = path.join(DIST_DIR, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    console.log(`📁 Looking for: ${filePath}`);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(DIST_DIR)) {
        console.log('❌ Security violation');
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(`❌ Error: ${err.message}`);
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end(`File not found: ${pathname}`);
            } else {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(`Server error: ${err.message}`);
            }
            return;
        }
        
        console.log(`✅ Serving: ${pathname}`);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${DIST_DIR}`);
    console.log('Press Ctrl+C to stop the server');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
