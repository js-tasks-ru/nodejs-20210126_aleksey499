const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { codeBlocks } = require('juice');
const { Stream } = require('stream');
const limitSizeStream = require('./LimitSizeStream')

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  const isNoNested = !(pathname.indexOf('/') + 1) // Не очевидно, но лучше в переменной описать что я тут нахожу - являеться ли путь вложеным

  const resolveData = JSON.stringify(req.headers)

  if (!isNoNested) {
    res.statusCode = 400
    res.end()
    return
  }

  switch (req.method) {
    case 'POST':
      const streame = fs.createReadStream(filepath)
      // Файл уже есть
      streame.on('open', () => {
        res.statusCode = 409
        res.end()
      })
      // Обработка ошибки - но если файла нет идем дальше
      streame.on('error', (err) => {
        if(err.code === 'ENOENT' ) return
        throw new Error(err)
      })
      // Создаем Стрим для записи, чтобы создать файт 
      // streame.pipe(fs.createWriteStream(filepath))
      // записываем в файл данные из req
      // .write(resolveData)

      req.on('aborted', () => {
        streame.destroy()
      })
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
