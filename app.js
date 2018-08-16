var express = require('express');
var app = express();
var fs = require('fs');
var FeederStatus = 0;
global.Feeding = false;
var objJson;
var bInit = true;


const winston = require('winston');
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = winston.createLogger({
 	format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), winston.format.simple()),
	transports: [ new (winston.transports.Console)({
      timestamp: tsFormat
    })]
});


var logging = function(log) {
	logger.info(log);
	//console.log(log);
};
var router = require('./router/main')(app, fs, FeederStatus, bInit, logging);
var Schedule = require('./Control/Schedule')(fs,objJson,bInit,logging);
app.use(express.static(__dirname + '/views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(8080, function() {
	logging('Express server has started on port 8080');
});