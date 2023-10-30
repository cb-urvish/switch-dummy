
function set_data(data,ip,port){
const net = require('net');	
var client = net.Socket();	
client.connect(port, ip, function() {
	console.log('Connected from outside');
	client.write(data);
	client.end()
	
});
client.on('data', function(data) {
	console.log('Received: ' + data);
	client.end()
});
client.on('close', function() {
	console.log('Connection closed');
});
}

module.exports = { set_data }