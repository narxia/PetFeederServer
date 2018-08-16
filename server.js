var express = require('express');
var app = express();
var fs = require('fs');
var FeederStatus = 0;
global.Feeding = false;
var objJson;
var bInit = true;



var winston = require('winston');

require('winston-daily-rotate-file');


//logger 설정
var transport = new winston.transports.DailyRotateFile({
	filename: './log/%DATE%.log',
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true,
	maxSize: '20m',
	maxFiles: '14d'
});

transport.on('rotate', function(oldFilename, newFilename) {
	// do something fun
});

var logger = winston.createLogger({
	format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.simple()),
	transports: [transport]
});


var logging = function(log) {
	logger.info(log);
	console.log(log);
};
var router = require('./router/main')(app, fs, FeederStatus, bInit, logging);
var Schedule = require('./Control/Schedule')(fs,objJson,bInit,logging);
app.use(express.static(__dirname + '/views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function() {
	logging('Express server has started on port 3000');
});