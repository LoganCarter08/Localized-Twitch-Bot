// found here: https://www.twilio.com/blog/creating-twitch-chat-bots-with-node-js
// token here: https://twitchapps.com/tmi/#access_token=k8xagcst97f9qbfz7tcztb97fd0d75&scope=chat%3Aread+chat%3Aedit+channel%3Amoderate+whispers%3Aread+whispers%3Aedit+channel_editor&token_type=bearer
// documentation is here: https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md#subscription

const tmi = require('tmi.js');
var robot = require("robotjs");
var express = require("express");
var app = express();
var router = express.Router();
const bodyParser = require('body-parser');
const say = require('say');
const fs = require('fs');



var pagePath = __dirname + '/Pages/';
var configPath = __dirname + '/Configs/';
var bitsForButtonsOn = false;
var statusString = 'Connected';
var loginClass = JSON.parse(fs.readFileSync(configPath + 'login.json'));

const reputation ={};

var client = new tmi.Client({
options: { debug: true},
	connection: {
		secure: true,
		reconnect: true
	},
	identity: {
		username: loginClass.username,
		password: loginClass.password
	},
	channels: [loginClass.channel]
});

client.connect().then((data) => {
    // data returns [server, port]
}).catch((err) => {
    statusString = 'Failed to login';
});

// following key presses need configured for Olen's account. In case he changed defaults
function returnRandomRLKey() {
	switch (Math.floor(Math.random() * 9)) {
		case 0:
			return "w";
		case 1:
			return "s";
		case 2:
			return "d";
		case 3:
			return "a";
		case 4:
			return "space";
		case 5:
			return ["mouse", "left"];
		case 6:
			return "shift";
		case 7:
			return "r";
		case 8:
			return ["mouse", "middle"]
		default:
			return "w";
	}
}

/*
	return an object that contains the title of the 
	purchased command along with a function to execute. 
	Could have been done differently, but this allows
	for a callback to be done and adds some flexibility 
	in the future. 
*/
function getCommandByBits(bits) {
	switch (true) {
		// 10 bits = pause button
		case (bits >= 10 && bits < 20):
			return {
				commandName : "pause press!",
				func : function() {
					robot.keyTap("escape");
				}
			};
		// 20 bits = gas held down for 10 seconds 
		case (bits >= 20 && bits < 30):
			return {
				commandName : "throttle for 10 seconds!",
				func : function() {
					robot.keyToggle("w", "down");
					setTimeout(function(){ robot.keyToggle("w", "up"); }, 10000);
				}
			};
		// 30 bits = brake held down for 10 seconds 
		case (bits >= 30 && bits < 50):
			return {
				commandName : "brake/reverse for 10 seconds!",
				func : function() {
					robot.keyToggle("s", "down");
					setTimeout(function(){ robot.keyToggle("s", "up"); }, 10000);
				}
			};
		// 50 bits = ebrake/roll held down for 20 seconds
		case (bits >= 50 && bits < 100):
			return {
				commandName : "ebrake for 20 seconds!",
				func : function() {
					robot.keyToggle("shift", "down");
					setTimeout(function(){ robot.keyToggle("shift", "up"); }, 20000);
				}
			};
		// 100 bits = boost held down for 10 seconds
		case (bits >= 100 && bits < 500):
			return {
				commandName : "boost for 10 seconds!",
				func : function() {
					robot.mouseToggle("down", "left");
					setTimeout(function(){ robot.mouseToggle("up", "left"); }, 10000);
				}
			};
		// 500 bits = 30 seconds of random buttons being pressed
		case (bits >= 500):
			return {
				commandName : "random buttons for 30 seconds!",
				func : function() {
					var startTime = new Date().getTime() / 1000;
					while(new Date().getTime() / 1000 < startTime + 30) {
						var key = returnRandomRLKey();
						if (key[0] === "mouse") {
							robot.mouseToggle("down", key[1]);
							var currentTime = new Date().getTime();
							while (currentTime < new Date().getTime + 500) {}
							robot.mouseToggle("up", key[1]);
						} else {
							robot.keyToggle(key, "down");
							var currentTime = new Date().getTime();
							while (currentTime < new Date().getTime + 500) {}
							robot.keyToggle(key, "up");
						}
					}
				}
			};
	} 
}

/*
	Somebody cheered. Announce this over TTS then 
	fuck up Olen's shit. 
	Hasn't been tested yet. Nobody has cheered while awake... 
*/
client.on('cheer', (channel, userstate, message) => {
	var obj = getCommandByBits(userstate.bits);
	if (bitsForButtonsOn) {
		obj["func"]();
		client.say(channel, "Thanks " + userstate.username + " for using " + userstate.bits + " bits for " + obj.commandName);
	}
});

function repeatitiveChatReminder() {
	if (bitsForButtonsOn) {
		client.say(loginClass.channel, 'If you would like to mess with Axiova, you can donate bits to effect his game! ' +
			'10 bits = pause button pressed. ' +
			'20 bits = gas held down for 10 seconds. ' + 
			'30 bits = brake held down for 10 seconds. ' +
			'50 bits = ebrake/roll held down for 20 seconds. ' +
			'100 bits = boost held down for 10 seconds. ' +
			'500+ bits = 30 seconds of random buttons being pressed.'
		);
	}
} setInterval(repeatitiveChatReminder, 600000);


client.on('subscription', (channel, username, method, message, userstate) => {
	
});



client.on('message', (channel, tags, message, self) => {
	if (tags.username.toLowerCase() === '') {
		
	}
	
	
	if (!message.startsWith('!')) {
		return;
	}

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
	
	if (tags.user-type === 'mod') {
		if (command === 'stop') {
			bitsForButtonsOn = false;
		} else if (command === 'start') {
			bitsForButtonsOn = true;
		}
	} 
	
	if (command === 'bits') {
		client.say(channel,
			'10 bits = pause button pressed. ' +
			'20 bits = gas held down for 10 seconds. ' + 
			'30 bits = brake held down for 10 seconds. ' +
			'50 bits = ebrake/roll held down for 20 seconds. ' +
			'100 bits = boost held down for 10 seconds. ' +
			'500+ bits = 30 seconds of random buttons being pressed.'
		);
	}
});










app.use("/",router);

app.listen(6969,function(){
	console.log("Live at Port 6969");
	//console.log(new Date().getMonth());
});

router.get("/",function(req,res){
	res.sendFile(pagePath + "index.html");
});

router.get("/status", function(req, res) {
	let obj = {};
	obj.power = bitsForButtonsOn;
	obj.status = statusString;
	obj.username = loginClass.username;
	obj.password = loginClass.password;
	obj.channel = loginClass.channel;
	res.send(obj);
});

router.get("/togglePower", function(req, res) {
	bitsForButtonsOn = !bitsForButtonsOn;
	let obj = {};
	obj.power = bitsForButtonsOn;
	res.send(obj);
});

router.get("/login",function(req,res){
	res.sendFile(pagePath + "login.html");
});

router.get("/bitsForButtons",function(req,res){
	res.sendFile(pagePath + "bitsForButtons.html");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/updateLogin', async function(req, res) {
	await res.send('ok');
	// Access the provided 'page' and 'limt' query parameters
	let user = req.query.username.toString();
	let pass = req.query.password.toString();
	let chann = req.query.channel.toString();
	
	let datas = {
		username : user, 
		password : pass, 
		channel : chann
	}


	datas = JSON.stringify(datas);
	fs.writeFileSync(configPath + 'login.json', datas);
	
	process.exit();
});

app.get('/kill', function(req, res) {
	require('child_process').exec('cmd /c stop.bat', function(){
		// …you callback code may run here…
	});
});