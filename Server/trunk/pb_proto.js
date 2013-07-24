/*
    ��Ŷ ���õ� �Լ����� ������ ���.
    - ���� ��ü�� ���������� ����.
    - ���������� ��Ŷ ���丮, �����Ĵ� ����, pinball�������� ������.
    - �ٸ� ����� ����� �������� ����.
*/
var protojs = require('protobufjs');

var maker_table = {},   //pair = msg_name + msg
    msg_id_table = {},  //pair = msg + msg_id
    msg_id_list = [];   //�޽����� ���̵� ��� �ٸ��� �˻��~

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

    //������ ������ ��Ŷ ����Ŀ ���
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
    "msg_id_list" : msg_id_list,  //�׽�Ʈ�뵵��
};