support = require('../supportFunctions.js');

router.get("/loadbfb", function(req, res) {
	// add the ability to create presets for different games
	try {
		if (!fs.existsSync(configPath + 'bfb/bitsForButtons.json')) {
			let datas = {
				amount : "", 
				button : "", 
				hold : "",
				time : "",
				description : ""
			}

			datas = JSON.stringify(datas);
			fs.writeFileSync(configPath + 'bfb/bitsForButtons.json', datas);
		}
		
		var bfb = JSON.parse(fs.readFileSync(configPath + 'bfb/bitsForButtons.json'));
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
		support.sayToChannel('Sorry, but I ran into an issue trying to load bits for buttons settings. Please see the log.');
	}
});