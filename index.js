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

let response = {};

io.on('connection', function(socket) {	
    console.log("Connected ", socket.id); 

	socket.emit('connect-item', 'ok')

	socket.on('stop-device', (val) => {
		socket.emit('arduno-stop', 'stop', 'stop');
	})

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


	socket.on('colors', (val) => {
		const {colors} = val;
		
		
		if (red !== parseInt(colors.slice(1,3))) {
			response = {color: '#e74c3c', total: parseInt(colors.slice(1,3)), type: 'red'}
		}

			
		if (green !== parseInt(colors.slice(3,5))) {
			response = {color: '#2ed573', total: parseInt(colors.slice(3,4)), type: 'green'}
		}

		if (blue !== parseInt(colors.slice(3,5))) {
			response = {color: '#1e90ff', total: parseInt(colors.slice(5,7)), type: 'blue'}
		}


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

