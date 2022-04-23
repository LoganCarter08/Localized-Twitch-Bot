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

try {
	client = new tmi.Client({
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