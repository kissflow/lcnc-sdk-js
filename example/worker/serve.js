const handler = require('serve-handler');
const http = require('https');
const fs = require('fs');
const path = require('path');

var options = {
  key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem'))
};

const server = http.createServer(options, (request, response) => {
  return handler(request, response);
});

server.listen(443,() => {
  console.log('Running at http://localhost:3000');
});