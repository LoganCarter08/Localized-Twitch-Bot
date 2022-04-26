const pressTheButton = function pressTheButton(button) {
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
		
		support.sayToChannel('Sorry, but I ran into an issue trying to press that button! ' +
			'Please make sure you set it up correctly and test with !bittest command.'
		);
	}
}

/*
	return an object that contains the title of the 
	purchased command along with a function to execute. 
	Could have been done differently, but this allows
	for a callback to be done and adds some flexibility 
	in the future. 
*/
const getCommandByBits = function getCommandByBits(bits) {
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

const handleBFBCheered = function handleBFBCheered(userstate) 
{
	try {
		fs.appendFileSync(logPath, userstate.username + ' has cheered ' + userstate.bits + 'bits\n');
		var obj = getCommandByBits(userstate.bits);
		if (bitsForButtonsOn) {
			obj["func"]();
			support.sayToChannel("Thanks " + userstate.username + " for using " + userstate.bits + " bits for " + obj.commandName);
		}
	} catch (error) {
		fs.appendFileSync(logPath, 'Ran into an error trying to get cheer info: \n');
		fs.appendFileSync(logPath, '\tError: ' + error.message + '\n');
		support.sayToChannel('Sorry, but I ran into an issue handling that cheer. Please check the log.');
	}
}

const getBitsForButtonsDescriptions = function getBitsForButtonsDescriptions() {
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

const bfbReminder = function bfbReminder()
{
	if (bitsForButtonsOn) {
		support.sayToChannel('If you would like to mess with ' + 
			loginClass.channel + 
			' , you can donate bits to effect his game! ' +
			getBitsForButtonsDescriptions()
		);
	}
}

module.exports = { bfbReminder, getBitsForButtonsDescriptions, handleBFBCheered, getCommandByBits, pressTheButton }