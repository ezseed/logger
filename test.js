var expect = require('chai').expect
  , p = require('path')
  , fs = require('fs')
  , rm = require('rimraf')
  , through = require('through2')
  , chalk = require('chalk')
  , log_path = p.join(__dirname, 'logs', 'out.log')

var logger = require('./index')()

var test = function(value, expected, config) {
	config = config ? config : {}

	return function(cb) {
		var stream = through(function (chunk, enc, next) {
		  chunk = new Buffer(chunk).toString()
	    expect(chunk).to.equal(expected) 
			
			cb()
	  })

		config.stdout = stream

		logger = require('./index')(config)
		logger.log(value)
	}

}

describe('functionnal', function() {

	it('should throw', function(cb) {
		try {
			require('./')({stdout: 'test'})
		} catch(e) {
			expect(e instanceof TypeError).to.be.true
			cb()
		}
	})

	it('should log through stream', function(cb) {
	
		var stream = through(function (chunk, enc, next) {
			chunk = new Buffer(chunk).toString()
      expect(chunk).to.equal('test\n')	  	
			cb()
	  })

		logger = require('./index')({stdout: stream, noprefix: true})
		logger.log('test')

	})

	it('should log without prefix', test('test', 'test\n', {noprefix: true}) )

	it('should log without newline', test('test', 'test', {newline: false, noprefix: true}) )

	it('should log without color', test('test', 'log: test\n', {nocolors: true}) )

	it('should log with date', test('test', '[' + new Date().toLocaleString() + '] ' + chalk.black('log') + ': test\n', {time: true}) )

	it('should log with color', test('test', chalk.black('log') + ': test\n') )
  
  it('should log with custom prefix', test('test', '\o/ test\n', {prefix: '\o/'}) )

	it('should log with child', test('test', '(child) test\n', {noprefix: true, child: 'child'}) )

	it('should log to file', function(cb) {
		logger = require('./index')({cwd: __dirname, noprefix: true, newline: false})
		logger.log('test')

		fs.createReadStream(log_path).on('data', function(d) {
			d = new Buffer(d).toString()

			expect(d).to.equal('test')

			cb()
		})
	})

	after(function() {
		rm.sync(p.dirname(log_path))
	})
})

describe('E2E', function() {

	it('should log', function() {
		logger = require('./index')()

		logger.log('test')
			.error('test')
			.warn('test')
			.info('test')
	})

	it('should log without prefix', function() {
		require('./')({noprefix: true}).log('test')
	})

	it('should log without newline', function() {
		require('./')({newline: false, noprefix: true}).error('test').log('test\n') //mocha issue?
	})

	it('should log without color', function() {
		require('./')({nocolors: true}).log('test').error('error')
	})

	it('should log with date', function() {
		require('./')({time: true}).log('test')
	})

	it('should log with color', function() {
		require('./')().log('test').error('test').warn('beautiful')
	})

	it('should log with custom prefix', function() {
		require('./')({prefix: '\\o/'}).log('test')
	})

	it('should log with child', function() {
		require('./')('child').log('test')
	})
	
	it('should log with child and no prefix', function() {
		require('./')('child', {noprefix: true}).log('test')
	})

	it('should log with child and all time', function() {
		require('./')('child', {time: true}).info('test')
	})
})
