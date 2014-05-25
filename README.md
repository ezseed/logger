logger https://travis-ci.org/ezseed/logger.svg?branch=master
======

Logger

## Example

```javascript
var logger = require('ezseed-logger')('child', {time: true})

logger.log('something')

logger = require('ezseed-logger')({prefix: 'my-prefix'})

logger.error('err').warn('warn')
```

[See here for more examples](https://github.com/ezseed/logger/blob/master/test.js)

## Methods

```javascript
.log()
.info()
.error()
.warn()
```

## Options

```javascript
{
	nocolors: true, //default false
	noprefix: true, //default false
	prefix: Date.now() + '[my-prefix]', //custom prefix, default "log|info|error|warn: "
	time: true, //default false - prefixes new Date().toLocaleString()
	newline: false, //no new line between logs
	stdout: fs.createWriteStream(), //default process.stdout
	stderr: fs.createWriteStream(), //default process.stderr
	cwd: __dirname, //default false - pipe logs to "cwd/logs/out|err.log", creates directory if it doesn't exists
}
```
