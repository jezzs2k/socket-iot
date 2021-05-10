const admin = require("firebase-admin");
const serviceAccount = require("./htcdt-iot-firebase-adminsdk-lvhlo-907df7608b.json");

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

const adminF = admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://htcdt-iot-default-rtdb.firebaseio.com/'
});

const db = adminF.database();
const ref = db.ref("/iot");

ref.once("value", function(snapshot) {
	console.log('snapshot.val()', snapshot.val());
});

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
		socket.emit('arduno-start', 'start', 'start');
		socket.emit('start-success');
	})

	socket.on('colors', (val) => {
		const colors = val?.colors;

		console.log(typeof colors, 'val', val, 'colors', colors);
		if (colors && typeof colors !== 'string') {
			return;
		}

	
		
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

		console.log(response);

		// ref.push().set({
		// 	date: new Date().toJSON(),
		// 	response
		// });


	});

	setInterval(() => {
		console.log(response);

		socket.emit('colors-to-app', response);
	}, 1000)
	
	socket.on('disconnect', function() {
		console.log("disconnect");
	})
});