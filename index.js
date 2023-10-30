var Service, Characteristic;
var net = require('net');
var exec = require('child_process');
var set = require('./setvalue.js');
var current_value = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

var current_state = [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false];

module.exports = (homebridge) => {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerPlatform("homebridge-dummy-switch", "Dummy-Switch", test);
}  
function test(log, config) 
{
  this.log = log;
  this.port = config["port"];
  this.total_switch = config["total_switch"];
  this.ip = config["ip"]; 
}

test.prototype.accessories = function(callback){
 var results = [];
 let client = new net.Socket();
 var ip = this.ip;
 var port = this.port;

 client.connect(port, this.ip, function() {
	console.log('Connected to Dummy Server at IP:',ip,'and port:',port);
  });

 client.on('data', function(data) {
	try {
	data = JSON.parse(data);
	results[data.id-1].updatevalue(Boolean(data.value));

	}catch(err){
		console.log(err);
	}
 });

 client.on('close', function() {
	console.log('Connection closed=',ip);
       client.connect({ port: port, host: ip });

 }); 

client.on('error', function(err) {
	console.log('err='+ip);
 });

 for (var i=1;i<=this.total_switch;i++){
		 results.push(new TEST_SWITCH(this.ip,this.port,i));
 }
 callback(results)
}
    
class TEST_SWITCH{
	constructor(ip, port, id){
	this.ip = ip;  
	this.port = port;
	this.id = id;
	this.name =  "TEST Switch-"+String(id);
	this.TEST_SWITCH = new Service.Switch(this.name);
	}	
	setsnswt(stt){ 	  
     // set.set_data('{"value":'+Number(stt)+',"id":"'+this.id+'"}', this.ip, this.port);
    }	
	getsnswt(){  
	  return current_state[this.id];	
	}	
	 getServices(){
      var infoService = new Service.AccessoryInformation();
        infoService
         .setCharacteristic(Characteristic.Manufacturer, "Chipbucket Solutions Pvt. Ltd.")
         .setCharacteristic(Characteristic.Model, "Test-Switch")
         .setCharacteristic(Characteristic.SerialNumber, this.id);
      this.TEST_SWITCH
         .getCharacteristic(Characteristic.On).onGet(this.getsnswt.bind(this)).onSet(this.setsnswt.bind(this)); 
	 return [infoService,this.TEST_SWITCH];
    }
	updatevalue(cs){
		this.TEST_SWITCH.getCharacteristic(Characteristic.On).updateValue(cs);
	}
}