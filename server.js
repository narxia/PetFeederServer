var express = require('express');
var app = express();
var fs  = require('fs');
var FeederStatus = 0;
var Feeding=false;
var router = require('./router/main')(app,fs,FeederStatus,Feeding);


app.use(express.static(__dirname +'/views'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000");
});