router.get("/status", function(req, res) {
	let obj = {};
	obj.power = bitsForButtonsOn;
	obj.status = statusString;
	obj.username = loginClass.username;
	obj.password = loginClass.password;
	obj.channel = loginClass.channel;
	res.send(obj);
});