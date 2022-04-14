// found here: https://www.twilio.com/blog/creating-twitch-chat-bots-with-node-js
// documentation is here: https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md#subscription

const tmi = require('tmi.js');
var robot = require("robotjs");
var express = require("express");
var app = express();
var router = express.Router();
const bodyParser = require('body-parser');
const say = require('say');
const fs = require('fs');

var logPath = __dirname + '/Log/log.txt';
let ts = Date.now();

let date_ob = new Date(ts);
let day = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();
fs.appendFileSync(logPath, '\n\nStarting at ' + hours + ':' + minutes + ':' + seconds + ' on ' + month + '-' + day + '-' + year + '\n');

var pagePath = __dirname + '/Pages/';
var configPath = __dirname + '/Configs/';
var bitsForButtonsOn = false;
var statusString = 'Connected';
var loginClass;
if (!fs.existsSync(configPath + 'login.json')) {
	let datas = {
		username : "", 
		password : "", 
		channel : ""
	}

	datas = JSON.stringify(datas);
	loginClass = datas;
	fs.writeFileSync(configPath + 'login.json', datas);
}
else {
	loginClass = JSON.parse(fs.readFileSync(configPath + 'login.json'));
}

const reputation ={};
try {
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
} catch (error) {
	fs.appendFileSync(logPath, 'Ran into an error trying to login.\n');
	fs.appendFileSync(logPath, '\tError: ' + error.message + '\n');
}

function pressTheButton(button) {
	try {
		if (button.includes("mouse")) {
			robot.mouseClick(button.split("_")[1]);
		} else if (button.includes("control_") || button.includes("command_") || button.includes("alt_") || button.includes("shift_")) {
			split = button.split("_");
			robot.keyTap(split[1], split[0]);
		} else {
			robot.keyTap(button);
		} 
	} catch (error) {
		fs.appendFileSync(logPath, 'Ran into an error trying to press the button: ' + button + '\n');
		fs.appendFileSync(logPath, '\tError: ' + error.message + '\n');
		client.say(channel, 'Sorry, but I ran into an issue trying to press that button! Please make sure you set it up correctly and test with !bittest command.');
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
	// retreive the json file results
	var bfb = JSON.parse(fs.readFileSync(configPath + 'bitsForButtons.json'));
	amounts = bfb.amount.split('`');
	buttons = bfb.button.split('`');
	hold = bfb.hold.split('`');
	times = bfb.time.split('`');
	descriptions = bfb.description.split('`');
	// run through and see if any of the amounts match up 
	for (i = 0; i < amounts.length; i++) {
		// if there's a match then grab the key press and hold 
		if (bits == amounts[i]) {
			if (buttons[i] == 'random') {
				return {
					commandName : "Random buttons for " + times[i] + " seconds!",
					func : function() {
						var startTime = new Date().getTime() / 1000;
						while (new Date().getTime() / 1000 < (startTime + parseFloat(times[i]))) {
							var key = Math.floor(Math.random() * (buttons.length - 1));
							while (buttons[key] == 'random') {
								key = Math.floor(Math.random() * (buttons.length - 1));
							}
							var startTime2 = new Date().getTime() / 1000;
							while (new Date().getTime() / 1000 < startTime2 + 0.5) {
								console.log(key);
								console.log(buttons[key]);
								robot.keyTap(buttons[key]);
							}
						}
					}
				};
			} else if (hold[i] == 'hold') {
				return {
					commandName : descriptions[i] + " for " + times[i] + " seconds!",
					func : function() {
						let ts = Date.now();
						seconds = Math.floor(ts / 1000)
						while (Math.floor(Date.now()/1000) < seconds+ 10) {
							pressTheButton(buttons[i]);
						}
					}
				};
			} else { // if press then call tap with the key 
				return {
					commandName : descriptions[i] + " press!",
					func : function() {
						pressTheButton(buttons[i]);
					}
				};
			}
		}
	}
}

//var obj = getCommandByBits(11);
//obj["func"]();

/*
	Somebody cheered.
*/
client.on('cheer', (channel, userstate, message) => {
	try {
		fs.appendFileSync(logPath, userstate.username + ' has cheered ' + userstate.bits + 'bits\n');
		var obj = getCommandByBits(userstate.bits);
		if (bitsForButtonsOn) {
			obj["func"]();
			client.say(channel, "Thanks " + userstate.username + " for using " + userstate.bits + " bits for " + obj.commandName);
		}
	} catch (error) {
		fs.appendFileSync(logPath, 'Ran into an error trying to get cheer info: \n');
		fs.appendFileSync(logPath, '\tError: ' + error.message + '\n');
		client.say(channel, 'Sorry, but I ran into an issue handling that cheer. Please check the log.');
	}
});


function getBitsForButtonsDescriptions() {
	// add a way to output these in order of bit value least to greatest
	try {
		var bfb = JSON.parse(fs.readFileSync(configPath + 'bitsForButtons.json'));
		amounts = bfb.amount.split('`');
		buttons = bfb.button.split('`');
		hold = bfb.hold.split('`');
		times = bfb.time.split('`');
		descriptions = bfb.description.split('`');
		result = "";
		for (i = 0; i < amounts.length - 1; i++) {
			result = result + amounts[i] + ' bits = ' + descriptions[i];
			if (buttons[i] == 'random') {
					result = result + ' random buttons pressed for ' + times[i] + ' seconds. ';
			} else {		
				if (hold[i] == 'hold') {
					result = result + ' button held for ' + times[i] + ' seconds. ';
				} else {
					result = result + ' button pressed. ';
				}
			}
		}
		return result;
	} catch (error) {
		fs.appendFileSync(logPath, 'Ran into an error trying to output bits for buttons descriptions.');
	}
}

function repeatitiveChatReminder() {
	if (bitsForButtonsOn) {
		client.say(loginClass.channel, 'If you would like to mess with ' + loginClass.channel + ' , you can donate bits to effect his game! ' +
			getBitsForButtonsDescriptions()
		);
	}
	
	/*if (bitsForButtonsOn) {
		var obj = getCommandByBits(15);
		obj["func"]();
		//client.say(channel, "Thanks " + userstate.username + " for using " + userstate.bits + " bits for " + obj.commandName);
		console.log(obj.commandName);
	}*/
	
} setInterval(repeatitiveChatReminder, 60000 * 15);


client.on('subscription', (channel, username, method, message, userstate) => {
	fs.appendFileSync(logPath, userstate.username + ' has subscribed!\n');
});

client.on('message', (channel, tags, message, self) => {
	if (!message.startsWith('!')) {
		return;
	}

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();
	
	//if (command === 'help') {
	//	client.say(channel, 'no');
	//}
	
	
	
	if (tags.badges.broadcaster || tags.mod) { // || tags.user-type === 'mod') {
		if (command === 'stopbfb') {
			bitsForButtonsOn = false;
			client.say(loginClass.channel, tags.username + ' has turned bits for buttons off!');
		} else if (command === 'startbfb') {
			bitsForButtonsOn = true;
			client.say(loginClass.channel, tags.username + ' has turned bits for buttons on!');
		}
	} 
	
	if (command === 'bits') {
		client.say(loginClass.channel,
			getBitsForButtonsDescriptions()
		);
	} else if (command.split(" ")[0] === 'bittest' && (tags.mod || tags.badges.broadcaster)) {
		var obj = getCommandByBits(parseInt(message.split(' ')[1]));
		if (bitsForButtonsOn) {
			obj["func"]();
		}
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

router.get("/togglebfb", function(req, res) {
	bitsForButtonsOn = !bitsForButtonsOn;
	let obj = {};
	obj.power = bitsForButtonsOn;
	res.send(obj);
});

router.get("/loadbfb", function(req, res) {
	// add the ability to create presets for different games
	try {
		if (!fs.existsSync(configPath + 'bitsForButtons.json')) {
			let datas = {
				amount : "", 
				button : "", 
				hold : "",
				time : "",
				description : ""
			}

			datas = JSON.stringify(datas);
			fs.writeFileSync(configPath + 'bitsForButtons.json', datas);
		}
		
		var bfb = JSON.parse(fs.readFileSync(configPath + 'bitsForButtons.json'));
		let obj = {};
		obj.amounts = bfb.amount;
		obj.buttons = bfb.button;
		obj.hold = bfb.hold;
		obj.times = bfb.time;
		obj.descriptions = bfb.description;
		res.send(obj);
	} catch (error) {
		fs.appendFileSync(logPath, 'Ran into an error trying to load bits for buttons settings\n');
		fs.appendFileSync(logPath, '\tError: ' + error.message + '\n');
		client.say(channel, 'Sorry, but I ran into an issue trying to load bits for buttons settings. Please see the log.');
	}
});

router.get("/applybfb", function(req, res) {
	try {
		// let's make an ugly string for each data type
		let amounts = req.query.amounts.toString();
		let buttons = req.query.buttons.toString();
		let hold = req.query.hold.toString();
		let times = req.query.times.toString();
		let descriptions = req.query.descriptions.toString();

		let datas = {
			amount : amounts, 
			button : buttons, 
			hold : hold,
			time : times,
			description : descriptions
		}

		datas = JSON.stringify(datas);
		fs.appendFileSync(logPath, 'Applying new bfb settings: ' + datas + '\n');
		fs.writeFileSync(configPath + 'bitsForButtons.json', datas);
	} catch (error) {
		fs.appendFileSync(logPath, 'Ran into an error trying to apply bits for buttons settings\n');
		fs.appendFileSync(logPath, '\tError: ' + error.message + '\n');
		client.say(channel, 'Sorry, but I ran into an issue trying to set the bits for buttons settings. Please see the log.');
	}
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
	});
});
