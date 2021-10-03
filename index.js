 //in order to go to the proxy use:
//www.thissite.com/proxy/url
const fs = require('fs');
const http = require('http');
const express = require('express');
const unblocker = require('unblocker');
const bodyParser = require('body-parser');
const userAgent = require('./user-agent.js');

const blacklist = require('./blacklist.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static('public'));

app.use(
	unblocker({
		requestMiddleware: [
			userAgent('uniblock v2.11'),

			blacklist({
				blockedDomains: [],
				message: 'Blacklisted site visited'
			})
		]
	})
);

app.get('/', (req, res) => {
	res.sendFile('./public/index.html');


	//req is request
	//res is response
});

app.post('/', function(req, res) {
	console.log(req.body.URL); // Have req.body.URL be written in logs.txt

	res.redirect("https://Neelsvilles-Node--javierfn.repl.co/proxy/"+req.body.URL);


	let path = 'data/logs.txt';
	let buffer = Buffer.from(req.body.URL + '\n');

	fs.open(path, 'a+', function(err, fd) {
		if (err) {
			throw 'Could not open file: ' + err;
		}

		fs.write(fd, buffer, 0, buffer.length, null, function(err) {
			if (err) throw 'let buffer file' + err;
			fs.close(fd, function() {
				console.log('Wrote file');
			});
		});
	});
	console.log('\033[2J');
});

app.listen(3000, function() {});
