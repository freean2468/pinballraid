/*
    패킷 관련된 함수들을 구현한 모듈.
    - 따로 객체를 생성하지는 않음.
    - 전역변수에 패킷 팩토리, 디스패쳐는 놓고, pinball서버에서 공유함.
    - 다른 사용자 모듈을 참조하지 않음.
*/
var protojs = require('protobufjs');

var maker_table = {},   //pair = msg_name + msg
    msg_id_table = {},  //pair = msg + msg_id
    msg_id_list = [];   //메시지의 아이디가 모두 다른지 검사용~

var s2c_pkg = protojs.protoFromFile('../../Protocol/s2c.proto').build('s2c');
var c2s_pkg = protojs.protoFromFile('../../Protocol/c2s.proto').build('c2s');

function genID(msg_name) {
    var id = 0;

    for (var index in msg_name) {
        id += msg_name.charCodeAt(index) * (index + 1);
    }
    return id;
}

function addMaker(msg_name, msg) {
    id = genID(msg_name);
    //console.log(msg_name + ":"+ id);

    msg_id_table[msg.prototype] = id;
    maker_table[msg_name] = msg;
    msg_id_list.push(id);
}

function init() {
    //var s2c_pkg = protojs.protoFromFile('../../Protocol/s2c.proto').build('s2c');
    //var c2s_pkg = protojs.protoFromFile('../../Protocol/c2s.proto').build('c2s');

    //서버가 보내는 패킷 메이커 등록
    addMaker('s2c.VersionInfo', s2c_pkg.VersionInfo);
    addMaker('s2c.UserInfo', s2c_pkg.UserInfo);
    addMaker('s2c.RelogInReply', s2c_pkg.RelogInReply);
    //----
    addMaker('c2s.VersionInfo', c2s_pkg.VersionInfo);
    addMaker('c2s.LogIn', c2s_pkg.LogIn);
    addMaker('c2s.RelogIn', c2s_pkg.RelogIn);
    addMaker('c2s.LogOut', c2s_pkg.LogOut);
}

function packetMaker(name) {
    return maker_table[name];
}

function sendPacket(socket, msg) {
	var id = msg_id_table[msg.__proto__];

    //console.log("sendpacket : " + id);    
    msg.encode();

    var packet = msg.toBuffer();
    var buffer = new Buffer(packet.length + 8);

	buffer.writeUInt32LE(buffer.length, 0);
    buffer.writeUInt32LE(id, 4);
    packet.copy(buffer, 8);
    
    //console.log("send packet :");
    //console.log(buffer);

	socket.write(buffer);
}

module.exports = {
    "s2c_pkg": s2c_pkg,
    "c2s_pkg": c2s_pkg,
    "init": init,
    "genID" : genID,
    "packetMaker" : packetMaker,
    "sendPacket" : sendPacket,
    "msg_id_list" : msg_id_list,  //테스트용도임
};