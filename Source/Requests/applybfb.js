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
		fs.writeFileSync(configPath + 'bfb/bitsForButtons.json', datas);
	} catch (error) {
		fs.appendFileSync(logPath, 'Ran into an error trying to apply bits for buttons settings\n');
		fs.appendFileSync(logPath, '\tError: ' + error.message + '\n');
		support.sayToChannel('Sorry, but I ran into an issue trying to set the bits for buttons settings. Please see the log.');
	}
});