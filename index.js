var chalk = require('chalk')
  , util = require('util')
  , mkdirp = require('mkdirp')
  , p = require('path')
  , fs = require('fs')

var logger = {
  out: function(stream) {
    if(!stream || typeof stream.write != 'function') {
      throw new TypeError('logger expects a writable stream instance')
    }

    var newline = this.config.newline === false ? '' : '\n'
      , child = this.config.child ? '(' + this.config.child + ') ' : ''

    var self = this

    return function() {

      if(process.argv.indexOf('-q') === -1 && process.argv.indexOf('-quiet') === -1) {
        stream.write(child + util.format.apply(this, arguments) + newline);
      }

      return self.logger
    }
  },
  prefix: function(method) {
    if(this.config.prefix)
      return this.config.prefix

    if(this.config.noprefix)
      return ''

    var prefix = ''
    prefix = this.config.nocolors ? method + ':' : this.config.colors[method](method) + ':'
    prefix = this.config.time ? '[' + new Date().toLocaleString() + '] ' + prefix : prefix

    return prefix
  },
  init: function(child, config) {

    if(typeof child == 'object') {
      config = child
      child = ''
    }

    config = config ? config : {}
    config.child = child || config.child || ''

    var stdout = config.stdout || process.stdout
      , stderr = config.stderr || process.stderr

    config.colors = config.colors || {
      log: chalk.black,
      info: chalk.blue,
      warn: chalk.yellow,
      error: chalk.red
    }

    if(config.cwd) {

      var log_path = p.join(config.cwd, 'logs')

      if(!fs.existsSync(log_path)) {
        mkdirp.sync(log_path)
      }

      stderr = fs.createWriteStream(p.join(log_path, 'err.log'))
      stdout = fs.createWriteStream(p.join(log_path, 'out.log'))
    }

    this.config = config
    this.logger = {}

    var self = this

    ;['log', 'info', 'warn', 'error'].forEach(function(method) {
      var binder = method == 'log' || method == 'info' ? self.out(stdout) : self.out(stderr)
        , prefixer = self.prefix(method)

      self.logger[method] = prefixer.length === 0 ? binder.bind(self) : binder.bind(self, prefixer)
    })

    return this.logger
  }
}

module.exports = logger.init.bind(logger)
