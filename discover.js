var dgram = require('dgram');
var server = dgram.createSocket("udp4");
var net = require('net');
var client = new net.Socket();
ip_address=[];
  
server.on("message", function (msg,info) {
    msg = JSON.parse(msg);
  //  console.log(msg.m_name,info.address);
   if(msg.cmd == "MST"){
    ip_address.push(info.address);
    ip_address.push(msg.m_name.slice(3,));
   }

})
.bind(13000, () => {
   server.setBroadcast(true);
   var message = Buffer.from('{"cmd":"MST"}');
   server.send(message, 0, message.length, 13001, "255.255.255.255");
});


function ip(serial){
var temp = ip_address.indexOf(serial);
console.log(serial , temp);
return ip_address[temp-1];
}


module.exports = { ip }
