const express = require('express');
const app = express();
const ip = require('ip');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
	allowEIO3: true,
});

console.log(process.env.PORT);

const PORT = process.env.PORT || 3000;

console.log(PORT);

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

app.get('/', (req, res) => {
	res.send('Hieu Dz');
})

let red = 0;
let blue = 0;
let green = 0;

let response = {};

io.on('connection', function(socket) {	
	console.log("Connected ", socket.id); 
	socket.on('stop-device', (val) => {
		socket.emit('arduno-stop', 'stop', 'stop');
	})

	socket.on('start-device', ({isStart}) => {
		// let redTest = 0;
		// let blueTest = 0;
		// let greenTest = 0;
		
		socket.emit('arduno-start', 'start', 'start');
		socket.emit('start-success');
		
		// setInterval(() => {
		// 	if (Math.random() > 0.8) {
		// 		redTest ++;
		// 		response = {color: '#e74c3c', total: redTest, type: 'red'}
		// 	}else if (Math.random() <= 0.8 && Math.random() > 0.5) {
		// 		greenTest ++;
		// 		response = {color: '#2ed573', total: greenTest, type: 'green'}
		// 	}else{
		// 		blueTest ++;
		// 		response = {color: '#1e90ff', total: blueTest, type: 'blue'}
		// 	}
		// 		socket.emit('colors-to-app', response)
		// 	}, 1500);
	})

	socket.on('colors', (val) => {
		const {colors} = val;

		console.log(typeof colors, 'val', val, 'colors', colors);
		
		// if (red !== parseInt(colors.slice(1,3))) {
		// 	response = {color: '#e74c3c', total: parseInt(colors.slice(1,3)), type: 'red'}
		// }

		// if (green !== parseInt(colors.slice(3,5))) {
		// 	response = {color: '#2ed573', total: parseInt(colors.slice(3,4)), type: 'green'}
		// }

		// if (blue !== parseInt(colors.slice(3,5))) {
		// 	response = {color: '#1e90ff', total: parseInt(colors.slice(5,7)), type: 'blue'}
		// }

		// socket.emit('colors-to-app', response);

		// red = parseInt(colors.slice(1,3));
		// green =  parseInt(colors.slice(3,5));
		// blue =  parseInt(colors.slice(5,7));

		

		// console.log(response);
	});
	
	socket.on('disconnect', function() {
		console.log("disconnect");
	})
});

