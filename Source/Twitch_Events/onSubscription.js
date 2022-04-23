function onSubscription(userstate) {
	fs.appendFileSync(logPath, userstate.username + ' has subscribed!\n');
} 


client.on('subscription', (channel, username, method, message, userstate) => {
	onSubscription();
});
