//global.g_version = 1234;
var pb_server = require('./pb_server'),
    pb_route = require('./pb_route');

var PORT = 7070,
    VERSION = 1;

var server = pb_server.createServer(VERSION, pb_route);
server.listen(PORT);

console.log("pb-tcp-server start at port " + PORT);

