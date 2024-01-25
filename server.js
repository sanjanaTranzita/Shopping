const http = require('http');
const fs = require('fs');
const express = require('express');
const server = http.createServer((req, res) => {
    console.log(req.url, req.method, req.headers);
    const url = req.url;
    const method = req.method;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url === '/message' && method === 'POST') {
        const body = [];
        //Event Listeners:
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            //Concatenating Chunks:
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];  // Extract the message from the form data
            fs.writeFile('message.txt', message, (err) => {
                //Handling errors
                if (err) {
                    console.error(err);
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                } else {
                    res.statusCode = 302;
                    res.setHeader('Location', '/');
                    return res.end();
                }
            });
        });
    } else {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>My first Nodejs page</title></head>');
        res.write('<body><h2>Hello, my Node.js Server!!</h2></body>');
        res.write('</html>');
        res.end();
    }
});
const serverPort = 3000;
server.listen(serverPort, () => {
    console.log(`Server is listening on http://localhost:${serverPort}/`);
});
