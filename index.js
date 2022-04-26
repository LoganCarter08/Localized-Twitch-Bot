// found here: https://www.twilio.com/blog/creating-twitch-chat-bots-with-node-js
// documentation is here: https://github.com/tmijs/docs/blob/gh-pages/_posts/v1.4.2/2019-03-03-Events.md#subscription

// import libraries
tmi = require('tmi.js');
robot = require("robotjs");
express = require("express");
app = express();
router = express.Router();
bodyParser = require('body-parser');
say = require('say');
fs = require('fs');

// define paths
logPath = __dirname + '/Log/log.txt';
pagePath = __dirname + '/Pages/';
configPath = __dirname + '/Configs/';

// ouptut startup to log file
let ts = Date.now();
let date_ob = new Date(ts);
let day = date_ob.getDate();
let month = date_ob.getMonth() + 1;
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();
fs.appendFileSync(logPath, '\n\nStarting at ' + hours + ':' + minutes + ':' + seconds + ' on ' + month + '-' + day + '-' + year + '\n');

// setup global variables
bitsForButtonsOn = false;
statusString = 'Connected';
loginClass = '';
DEBUG = false;

// import our supporting code 
support = require('./Source/supportFunctions.js');
buttonPressing = require('./Source/buttonPressing.js');
require('./Source/login.js');
require('./Source/Twitch_Events/onCheer.js');
require('./Source/Twitch_Events/onSubscription.js');
require('./Source/Twitch_Events/onMessage.js');
require('./Source/Requests/applybfb.js');
require('./Source/Requests/bitsforbuttons.js');
require('./Source/Requests/kill.js');
require('./Source/Requests/loadbfb.js');
require('./Source/Requests/login.js');
require('./Source/Requests/status.js');
require('./Source/Requests/togglebfb.js');
require('./Source/Requests/updatelogin.js');


// output periodic messages
function repeatitiveChatReminder() {
	bfbReminder();
	/*if (bitsForButtonsOn) {
		var obj = getCommandByBits(15);
		obj["func"]();
		//client.say(channel, "Thanks " + userstate.username + " for using " + userstate.bits + " bits for " + obj.commandName);
		console.log(obj.commandName);
	}*/
	
} setInterval(repeatitiveChatReminder, 60000 * 15);


// setup up requests 
app.use("/",router);

app.listen(6969, function(){
	console.log("Live at Port 6969");
});

router.get("/",function(req,res){
	res.sendFile(pagePath + "index.html");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
