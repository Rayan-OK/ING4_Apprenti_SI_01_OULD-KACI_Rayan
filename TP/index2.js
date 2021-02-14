const http = require('http');
// Declare an http server
http.createServer(function (req, res) {

  // Write a response header
  res.writeHead(200, {'Content-Type': 'text/plain'});

  // Write a response content
  res.end('Hello World\n');

  const content = '<!DOCTYPE html>' +
'<html>' +
'    <head>' +
'        <meta charset="utf-8" />' +
'        <title>ECE AST</title>' +
'    </head>' + 
'    <body>' +
'       <p>Hello World !</p>' +
'    </body>' +
'</html>';

const serverHandle = function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(content);
  res.end();
}

// Start the server
}).listen(8080);