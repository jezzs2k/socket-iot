const PORT = 3484;								
 
const http = require('http');					
const socketio = require('socket.io');	
 
const ip = require('ip');
const app = http.createServer();
var io = socketio(app);

app.listen(PORT);
console.log("Server run with port: " + ip.address() + ":" + PORT)
 
io.on('connection', function(socket) {	
    console.log("Connected"); 
	
	socket.on('atime', (val) => {
		console.log(val);
	})

	socket.on('colors', (val) => {
		console.log(val);
		socket.emit('colors-to-app', val);
	});


	socket.on('disconnect', function() {
		console.log("disconnect");
	})
});