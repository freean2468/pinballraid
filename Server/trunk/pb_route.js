/*
    클라에서 받은 데이타 스트림을 해석하는 곳. 
    - 핸들러함수로 이어주는 역활만 함
    - 객체 생성없이 모든 pinball서버에서 공유함.
*/

var handler = require('./pb_handler'),
    proto = require('./pb_proto');

//서버가 받은 패킷을 해석하고 핸들러로 보내기 위한 배열
var decode_table = {};
var dispatcher_table = {};

function registerPacketHandler(msg_name, msg, handler) {
	var id = proto.genID(msg_name);

	decode_table[id] = msg;
	dispatcher_table[id] = handler;
}

function init() {
    proto.init();

    //서버가 받은 패킷을 해석하는 팩토리 만들고, 
	//서버가 받은 패킷을 핸들러로 보내는 dispatcher 설정하기
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

// 익스포트 리스트
module.exports = {
    "init": init,
    "processPakcet" : processPakcet,
};

