const sayToChannel = function sayToChannel(outputText) {
	if (!DEBUG)
		client.say(loginClass.channel, outputText);
	else 
		console.log(outputText);
}

module.exports = { sayToChannel }