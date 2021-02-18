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
    res.end()
    return
  }

  switch (req.method) {
    case 'DELETE':
      fs.unlink(filepath, (err) => {
        if(err) {
          err.code === 'ENOENT' ? res.statusCode = 404 : res.statusCode = 500
          res.end('no')
          return
        }
        res.end('ok')
      })
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
