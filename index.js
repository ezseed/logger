var bunyan = require('bunyan')
  , p = require('path')
  , fs = require('fs')
  , exists = false

/**
 * LEVELS
 * "fatal" (60): The service/app is going to stop or become unusable now. An operator should definitely look into this soon.
 * "error" (50): Fatal for a particular request, but the service/app continues servicing other requests. An operator should look at this soon(ish).
 * "warn" (40): A note on something that should probably be looked at by an operator eventually.
 * "info" (30): Detail on regular operation.
 * "debug" (20): Anything else, i.e. too verbose to be included in "info" level.
 * "trace" (10): Logging from external libraries used by your app or very detailed application logging.
 */

module.exports = function (config, child) {

	config = config ? config : {}
	config.name = config.name ? config.name : 'ezseed'
	
	if(!config.streams) {
		if(process.env.DEBUG) {

			config.src = true
			config.streams = [
			    {
			      stream: require('bunyan-format')({ outputMode: 'long', colorFromLevel: true }),
			    }
			]

		} else {
			var cwd = config.cwd ? config.cwd : process.cwd()
			  , log_path = p.join(cwd, 'logs')

			if(!exists && !fs.existsSync(log_path)) {
				console.log('test')
				fs.mkdirSync(log_path)
				exists = true
			}

			config.streams = [
			    {
					type: 'rotating-file',
			        path: p.join(log_path, 'out.log'),
			        period: '1d',   // daily rotation - default
			        count: 10 //keep 10 max - default
			    },
			    {
					level: 'error',
					type: 'rotating-file',
					path: p.join(log_path, 'err.log')
			    }
			]
		}
	}
	
	return child ? bunyan.createLogger(config).child({module: child}) : bunyan.createLogger(config)

}