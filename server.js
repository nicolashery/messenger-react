var http = require('http');

var connect = require('connect');
var serveStatic = require('serve-static');

var app = connect();

var staticDir = __dirname;
app.use(serveStatic(staticDir));

var port = process.env.PORT || 3000;
var server = http.createServer(app).listen(port);
console.log('Connect server started on port', port);
console.log('Serving static directory "' + staticDir + '/"');
