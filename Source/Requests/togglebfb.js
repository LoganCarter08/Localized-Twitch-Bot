router.get("/togglebfb", function(req, res) {
	bitsForButtonsOn = !bitsForButtonsOn;
	let obj = {};
	obj.power = bitsForButtonsOn;
	res.send(obj);
});