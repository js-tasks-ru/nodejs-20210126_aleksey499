const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs')

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const isNoNested = !(pathname.indexOf('/') + 1) // Не очевидно, но лучше в переменной описать что я тут нахожу - являеться ли путь вложеным

  if (!isNoNested) {
    res.statusCode = 400
    res.end('No access')
  }

  switch (req.method) {
    case 'GET':
      if(filepath)

      fs.createReadStream(filepath)
        .on('error', (err) => {
          if (err.code === 'ENOENT') {
            res.statusCode = 404;
            res.end('No file')
          }
        }).on('data', (chunk) => {
          res.statusCode = 200
          res.end(chunk)
        })

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
