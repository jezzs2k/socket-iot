const express = require('express');
const app = express();
const ip = require('ip');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	path: '/client'
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

let response = {};

const updateItem = (colors) => {
	//list ==> {red: '', green: '', blue: ''}

	
};

io.on('connection', function(socket) {	
    console.log("Connected ", socket.id); 

	socket.emit('connect-item', 'ok')

	//demo
	setInterval(() => {
		if (Math.random() > 0.8) {
			red ++;
			response = {color: '#e74c3c', total: red, type: 'red'}
		}else if (Math.random() <= 0.8 && Math.random() > 0.5) {
			green ++;
			response = {color: '#2ed573', total: green, type: 'green'}
		}else{
			blue ++;
			response = {color: '#1e90ff', total: blue, type: 'blue'}
		}
			socket.emit('colors-to-app', response)
		}, 1000);

	socket.on('stop-device', (val) => {
		socket.emit('arduno-stop', 'stop', 1);
	})

	socket.on('colors', (val) => {
		console.log(val);
		socket.emit('colors-to-app', val);
	});

	socket.on('disconnect', function() {
		console.log("disconnect");
	})
});

