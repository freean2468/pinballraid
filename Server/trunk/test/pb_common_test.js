/*
    �⺻���� �������� �� ��� ���� �׽�Ʈ��
    - ��������id�� �ߺ��Ǹ� �ȵȴ�.
    - ���� ������ ���� �ùٸ��� �ְ� �޴´�.
    -
*/

var net = require('net'),
    assert = require('assert'),
    pb_server = require('../pb_server'),
    pb_route = require('../pb_route'),
	pb_proto = require('../pb_proto');

module.exports = {
    '�������� ���̵�� �����ϴ�' : function() {
        pb_proto.msg_id_list.forEach(function(id) {
            var count = 0;
            pb_proto.msg_id_list.forEach(function(id2) {
                if (id == id2) ++count;
            });

            assert.equal(count, 1); // �ڱ��ڽſܿ��� ���� �� ����.
        });
    }
    ,
    '���������� �ùٸ��� �ְ� �޴´�.' : function () {
        var HOST = '127.0.0.1';
        var PORT = 7770;
        var version = 1234;

        var server = pb_server.createServer(version, pb_route);
		server.listen(PORT);

		var client = new net.Socket();
		client.connect(PORT, HOST, function () {
            //console.log('CONNECTED TO: ' + HOST + ':' + PORT);
			
            client.stream = new Buffer(20);
			client.index_of_stream = 0;
		
			//send version packet
			var VersionInfo = pb_proto.packetMaker('c2s.VersionInfo');
			var msg = new VersionInfo;
			msg['version'] = version;
			pb_proto.sendPacket(client, msg);           
		});

		// Add a 'data' event handler for the client socket
		// data is what the server sent to this socket
		client.on('data', function (data) {
			data.copy(client.stream, client.index_of_stream, 0);
			client.index_of_stream += data.length;
			
			var len = client.stream.readUInt32LE(0);
			if (len <= client.index_of_stream) {
				var data = new Buffer(len - 8);	//len�� 4����Ʈ�� ������
				client.stream.copy(data, 0, 8, len);
				client.stream = client.stream.slice(len);
				
				var msg = pb_proto.packetMaker('s2c.VersionInfo').decode(data);
				assert.equal(msg['version'], version);
				
				client.destroy();
			}
		});

		// Add a 'close' event handler for the client socket
		client.on('close', function () {
			console.log('Connection closed');
            server.close();
		});
    },
};