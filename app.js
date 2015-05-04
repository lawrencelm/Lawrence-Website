//Simple demo for World Weather Online using ajax/jquery/underscore

var express = require("express");

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort("/dev/tty.usbmodemfd121", {baudrate: 9600, parser: require("serialport").parsers.readline('\n')}, false);

var fs = require('fs');
var concentration = false;

function getDirectories() {
  return fs.readdirSync('/dev/').filter(function (file) {
    return file.indexOf('tty.usbmodem') > -1;
  });
}

if(getDirectories().length > 0)
{
	var SerialPort = require("serialport").SerialPort
	var serialPort = new SerialPort("/dev/" + getDirectories()[0], {baudrate: 9600, parser: require("serialport").parsers.readline('\n')}, false);
	console.log("Arduino detected");
	serialPort.open(function (error) 
	{ 
		serialPort.on('data', function(data) 
			{ 
				if(String(data).indexOf("High") > -1)
				{
					concentration = true;
				}
				else
				{
					concentration = false;
				}
			});
	}
);
}

var app = express();

app.use("", express.static("/Users/Lawrence/Documents/Git\ Hub/Law-Web/"));

app.get("/", function(req, res){
	if(!concentration)
	{
        res.sendfile("./index.html");
    }
    else
    {
    	res.sendfile("./index_concentration.html");
    }
});

app.listen(8000);
console.log("listening on port 8000");
