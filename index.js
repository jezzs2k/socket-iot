const express = require('express');
const http = require('http');
const socketio = require('socket.io');	
const bodyParser = require('body-parser');
const ip = require('ip');

const PORT = 3484;								
 
const app = express()

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Origin', '*');
	next();
});

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);

server.listen(PORT, () => {
	console.log("Server run with port: " + ip.address() + ":" + PORT)
});

const io = socketio.listen(server);

io.on('connection', function(socket) {	
    console.log("Connected"); 
	console.log(socket.id);
	

	socket.emit('colors-to-app', 'adasda')

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