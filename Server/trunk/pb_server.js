// Load the TCP Library
var net = require('net');
var pb_route = require('./pb_route');

function myClient(socket) {
	//프로퍼티
	this.stream = new Buffer(20);
	this.index_of_stream = 0;
	this.socket = socket;	//클라이언트 소켓

	//메소드
}

function createServer(version, route) {
    //console.log(route);
	route.init();

    var tcp = net.createServer(function (socket) {
        //console.log("new client connect");

		var client = new myClient(socket);
        //tcp.version = version;
		tcp.client_list = {};
		tcp.client_list[socket] = client;
        socket.version = version;
 
        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            //console.log(socket.remoteAddress + ":" + socket.remotePort +" + data);
			
            var client = tcp.client_list[socket];
            //console.log(client);

			data.copy(client.stream, client.index_of_stream, 0);
			client.index_of_stream += data.length;

            var len = client.stream.readUInt32LE(0);
            //console.log("server receive :");
            //console.log(client.stream);
			
            if (len <= client.index_of_stream) {
				var data = new Buffer(len - 4);	//len인 4바이트는 버린다
                if (client.stream.length < len) return;

				client.stream.copy(data, 0, 4, len);
				client.stream = client.stream.slice(len);
				route.processPakcet(socket, data);
			}
        });
 
        // Remove the client from the list when it leaves
        socket.on('end', function () {
            delete tcp.client_list[socket];
			console.log(socket + "leave");
        });
    });
    return tcp;
}

createServer(0, pb_route);

//pb_sever method
module.exports = {
    'createServer' : createServer,
};
