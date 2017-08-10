var connect = require('connect');
var serveStatic = require('serve-static');
var serveIndex = require('serve-index');
var port = 1392;
connect()
	.use(serveStatic(__dirname))
	.use('/mp3', serveIndex(__dirname + '/mp3'))
	.listen(port);
console.log('server running on port',port);
console.log('open browser to http://localhost:'+port+'/');