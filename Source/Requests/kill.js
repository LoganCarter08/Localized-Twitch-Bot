app.get('/kill', function(req, res) {
	require('child_process').exec('cmd /c stop.bat', function(){
	});
});