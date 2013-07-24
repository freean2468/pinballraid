/*
    Ŭ�󿡼� ���� ����Ÿ ��Ʈ���� �ؼ��ϴ� ��. 
    - �ڵ鷯�Լ��� �̾��ִ� ��Ȱ�� ��
    - ��ü �������� ��� pinball�������� ������.
*/

var handler = require('./pb_handler'),
    proto = require('./pb_proto');

//������ ���� ��Ŷ�� �ؼ��ϰ� �ڵ鷯�� ������ ���� �迭
var decode_table = {};
var dispatcher_table = {};

function registerPacketHandler(msg_name, msg, handler) {
	var id = proto.genID(msg_name);

	decode_table[id] = msg;
	dispatcher_table[id] = handler;
}

function init() {
    proto.init();

    //������ ���� ��Ŷ�� �ؼ��ϴ� ���丮 �����, 
	//������ ���� ��Ŷ�� �ڵ鷯�� ������ dispatcher �����ϱ�
	registerPacketHandler('c2s.VersionInfo', proto.c2s_pkg.VersionInfo, handler.P_Version);
    registerPacketHandler('c2s.LogIn', proto.c2s_pkg.LogIn, handler.P_LogIn);
    registerPacketHandler('c2s.RelogIn', proto.c2s_pkg.RelogIn, handler.P_RelogIn);
    registerPacketHandler('c2s.LogOut', proto.c2s_pkg.LogOut, handler.P_LogOut);
}

// size + data = header(id) + body(protobuf)
function processPakcet(socket, data) {
    if (data.length <= 0) return;

    //console.log("[processPacket] id :" + id)
    //console.log(data);

    var id = data.readInt32LE(0);

    if (decode_table[id] == null) {
        console.log("no factory for packet : " + id);
        return;
    }

    var msg = decode_table[id].decode(data.slice(4));

    if (dispatcher_table[id] == null || typeof dispatcher_table[id] != 'function') {
        console.log("no dispatcher for packet" + id);
        return;
    }

    //console.log("[processPacket] " + msg);
    dispatcher_table[id](socket, msg);
}

// �ͽ���Ʈ ����Ʈ
module.exports = {
    "init": init,
    "processPakcet" : processPakcet,
};

