const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.accum = '';
  }

  _transform(chunk, encoding, callback) {
    this.accum += chunk;

    if (this.accum.includes(os.EOL)) {
      const lines = this.accum.split(os.EOL);
      this.accum = lines.pop();
      lines.forEach(data => this.push(data));
    }

    callback();
  }

  _flush(callback) {
    if (this.accum) this.push(this.accum);
    callback();
  }
}

module.exports = LineSplitStream;
