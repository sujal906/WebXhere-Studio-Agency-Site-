const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8000;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm'
};

const server = http.createServer((req, res) => {
    req.on('error', () => {});
    res.on('error', () => {});

    let safeUrl = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    let filePath = path.join(__dirname, safeUrl === '/' ? 'index.html' : safeUrl);

    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end('404 Not Found');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        const range = req.headers.range;
        if (range && (ext === '.mp4' || ext === '.webm')) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
            const chunksize = (end - start) + 1;
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stats.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
                'Referrer-Policy': 'strict-origin-when-cross-origin'
            });
            const stream = fs.createReadStream(filePath, { start, end });
            res.on('close', () => stream.destroy());
            stream.on('error', () => {
                if (!res.headersSent) res.writeHead(500);
                res.end();
            });
            stream.pipe(res);
            return;
        }

        res.writeHead(200, { 
            'Content-Type': contentType,
            'Content-Length': stats.size,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        });
        const stream = fs.createReadStream(filePath);
        stream.on('error', () => {
            if (!res.headersSent) res.writeHead(500);
            res.end();
        });
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log('WebXHere Studio running at http://localhost:' + PORT);
});
