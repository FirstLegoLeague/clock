var connect = require('connect');
var serveStatic = require('serve-static');
var argv = require('minimist')(process.argv.slice(2));
var morgan =  require('morgan');

var fs = require('fs');

var port = 1392;
connect()
	.use(morgan('DEBUG [:date[iso]]: :method :url - :status in :response-time ms'))
	.use('/config.js', function(req, res, next) {
		if(argv.c) {
			fs.readFile(argv.c, function(err, data) {
				if(err) {
					res.write("Internal server error: couldn't read config file.")
					res.statusCode = 500;
				} else {
					res.write(data);
				}
				res.end();
			});
		} else {
			next();
		}
	})
	.use(serveStatic(__dirname))
	.listen(port);
console.log('server running on port',port);
console.log('open browser to http://localhost:'+port+'/');