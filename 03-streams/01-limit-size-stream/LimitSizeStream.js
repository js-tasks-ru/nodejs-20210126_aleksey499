const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.__limit = options.limit || 4
    this.__accumByte = 0
  }

  _transform(chunk, encoding, callback) {
    this.__accumByte += chunk.byteLength
    this.__accumByte > this.__limit ? callback(new LimitExceededError()) : callback(null, chunk)
  }
}

module.exports = LimitSizeStream;
