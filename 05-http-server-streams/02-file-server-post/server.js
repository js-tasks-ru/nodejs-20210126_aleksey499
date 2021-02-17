const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const limitSizeStream = require('./LimitSizeStream');
const server = new http.Server();

async function createHundler (req, filepath) {
  const creater = fs.createWriteStream(filepath, { flags:'wx' })
  const limiter = new limitSizeStream({ limit: 10000 })

  return new Promise((res, rej) => {
    req.on('aborted', () => res({ code: 404, value: 'DISCONECTION', isError: true }) )
    .pipe(limiter)
      .on('error', (err) => {
        if (err.code === 'LIMIT_EXCEEDED') res({ code: 413, value: 'LIMIT_EXCEEDED', isError: true })
        res({ code: 500, value: 'LIMIT_UnKnow_error', isError: true })
      })
    .pipe(creater)
      .on('error', (err) => {
        if (err.code === 'EEXIST') res({ code: 409, value: 'FILE_eexist' })
        res({ code: 500, value: 'CREATER_UnKnow_error' })
      })
      .on('finish', () => res({ code: 201, value: 'Успешно' }) )
  })
}

server.on('request', async (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const isNoNested = !(pathname.indexOf('/') + 1) // Не очевидно, но лучше в переменной описать что я тут нахожу - являеться ли путь вложеным

  if (!isNoNested) {
    res.statusCode = 400
    res.end()
    return
  }

  switch (req.method) {
    case 'POST':
      const answer = await createHundler(req, filepath)
      res.statusCode = answer.code
      res.end(answer.value)
      if (answer.isError) fs.unlink(filepath, () => {})
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});
module.exports = server;
