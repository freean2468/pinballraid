/*
    *.proto 파일에 있는 default = 숫자 값을 올바른 값으로 수정하는 역활을 한다.
*/
fs = require('fs');

var msg_id_list = [];

var content = fs.readFileSync(process.argv[2], { encoding: 'utf-8', flag: 'r' });
var list = content.split("message");

var ret;

for (var c_index in list) {

    if (c_index > 0) {

        var end_index = list[c_index].search("{");
        var msg = list[c_index].slice(0, end_index);

        var msg_id = 0;
        for (var index in msg) {
            if (msg.charAt(index) != 0) {
                msg_id += msg.charCodeAt(index);
            }
        }

        //console.log(msg + ":" + msg_id);
        //msg_id_list.push(msg_id);
        ret += "message" + list[c_index].replace(RegExp("default = [0-9]*"), "default = " + msg_id);
        //console.log(ret);

        //s1 = s1.replace("}", "\toptional string msg_name [default = " + msg.trim() + "];\n}");
        //ret += "message" + s1;
    }
    else {
        ret = list[c_index];
    }
}

//console.log(ret);
fs.writeFileSync(process.argv[2], ret);