const http = require('http');
const url = require('url');

const PORT = 5001;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;

    if (path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to My Website</h1>\n<p>This is the home page.</p>');
    } 
    else if (path === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('This is About Page');
    } 
    else if (path === '/contact') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Contact Us</h1>\n<p>Email: example@mail.com</p>');
    } 
    else if (path === '/api/users') {
        const users = [
            { "id": 1, "name": "Anna" },
            { "id": 2, "name": "Nick" }
        ];
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
    } 
    else if (path === '/time') {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        const timeString = `Current time: ${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(timeString);
    } 
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Page Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
