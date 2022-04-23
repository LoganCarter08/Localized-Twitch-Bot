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