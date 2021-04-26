const express = require('express');
const app = express();
const ip = require('ip');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	allowEIO3: true,
});
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log("Server run with port: " + ip.address() + ":" + PORT)
});

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Origin', '*');
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let red = 0;
let blue = 0;
let green = 0;

io.on('connection', function(socket) {	
    console.log("Connected ", socket.id); 

	socket.emit('connect-item', 'ok')

	socket.on('stop-device', (val) => {
		socket.emit('arduno-stop', 'stop', 'stop');
	})

	socket.on('colors', (val) => {
		const {colors} = val;
		
		red = parseInt(colors.slice(1,3));
		green =  parseInt(colors.slice(3,5));
		blue =  parseInt(colors.slice(5,7));

		socket.emit('colors-to-app', {red, green, blue});
	});

	socket.on('atime', (val) => {
		console.log(val);
	});

	socket.on('disconnect', function() {
		console.log("disconnect");
	})
});

