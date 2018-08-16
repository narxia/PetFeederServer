module.exports = function(fs,  objJson, bInit,logger) {
	var moment = require('moment');
	setInterval(function() {
		if (bInit) {
			var data = fs.readFileSync(__dirname + '/../data/' + 'Setting.json', 'utf8');
			{
				console.log('Read Json File');
				objJson = JSON.parse(data);
				//console.log(objJson.time);
			}
			bInit = false;
		}
		var arrayTime = objJson.time;
		//console.log(objJson);

		//var Now_date_time = new Date();
		//console.log("Now : "+moment().format("YYYY-MM-DD HH:mm:ss"));
		//console.log("hour : "+moment().hours());
		//console.log("minute : "+moment().minutes());
		var c_hour = moment().hours();
		var c_minute = moment().minutes();
		for (var i = 0; i < arrayTime.length; i++) {
			//console.log(arrayTime[i]);

			var splitString = String(arrayTime[i]).split(':');
			f_hour = Number(splitString[0]);
			f_minute = Number(splitString[1]);
			if (c_hour == f_hour && c_minute == f_minute && moment().seconds() === 0) 
			{
				logger('['+i+']'+arrayTime[i] + '  NOW FEEDING !!!!');	
				global.Feeding = true;
			}
		}

		//console.log(Now_date_time);

		
	}, 1000);
};