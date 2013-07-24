//var pb_route = require('pb_route');   순환 참조는 해석 에러남~
var pb_proto = require('./pb_proto');

function Process_Version(socket, data) {
	console.log("[Process_Version] Version : " + data['version']);

    var VersionInfo = pb_proto.packetMaker('s2c.VersionInfo');
    var msg = new VersionInfo;
    msg['version'] = socket.version;
    pb_proto.sendPacket(socket, msg);
}

function Process_LogIn(socket, data) {
    console.log("Process_LogIn called");
}

function Process_RelogIn(socket, data) {
    console.log("Process_RelogIn called");
}

function Process_LogOut(socket, data) {
    console.log("Process_LogOut called");
}

module.exports = {
	"P_Version" : Process_Version,
    "P_LogIn" : Process_LogIn,
    "P_RelogIn" : Process_RelogIn,
    "P_LogOut" : Process_LogOut,
};

