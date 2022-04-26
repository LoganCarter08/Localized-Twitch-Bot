// this is for debugging purposes. We need to create a generic tags object or store real ones for a unit test 
function onMessage(message, tags) {
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
			support.sayToChannel(tags.username + ' has turned bits for buttons off!');
		} else if (command === 'startbfb') {
			bitsForButtonsOn = true;
			support.sayToChannel(tags.username + ' has turned bits for buttons on!');
		}
	} 
	
	if (command === 'bits') {
		support.sayToChannel(getBitsForButtonsDescriptions());
	} else if (command.split(" ")[0] === 'bittest' && (tags.mod || tags.badges.broadcaster)) {
		var obj = getCommandByBits(parseInt(message.split(' ')[1]));
		if (bitsForButtonsOn) {
			obj["func"]();
		}
	}
}

// **********************************************************************************************************************
// this needs tested. Haven't tried with these changes yet
// **********************************************************************************************************************
client.on('message', (channel, tags, message, self) => {
	onMessage(message, tags);
});