// this is for debugging purposes. We need to create a generic userstate object or store real ones for a unit test 
function onCheer(userstate) {
	handleBFBCheered(userstate);
}

// Somebody cheered.
// **********************************************************************************************************************
// this needs tested. Haven't tried with these changes yet
// **********************************************************************************************************************
client.on('cheer', (channel, userstate, message) => {
	onCheer(userstate);
});