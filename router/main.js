module.exports = function(app, fs, FeederStatus, bJsonInit,logger,objJson, bInit) 

{
	//main Page
	app.get('/', function(req, res) {
		fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
			//console.log( data );
			var objJson = JSON.parse(data);

			res.render('index', {
				title: '봄이의 밥그릇',
				length: objJson.count,
				Time: objJson.time,
				Status: FeederStatus
			});
		});
	});
	//Append Schedule Data(json)
	app.get('/Append', function(req, res) {
		if (req.query.AMPM !== '' && req.query.hour !== '' && req.query.Minute !== '') {
			fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
				// append Data
				var objJson = JSON.parse(data);
				var hour = Number(req.query.AMPM) + Number(req.query.hour);
				var Min = req.query.Minute;
				var time = hour + ':' + Min;

				var count = objJson.count;

				objJson.time.push(time);
				logger("Append : "+time);
				objJson.count = objJson.time.length;
				fs.writeFile(
					__dirname + '/../data/Setting.json',
					JSON.stringify(objJson, null, '\t'),
					'utf8',
					function(err, data) {}
				);
				bJsonInit= true;
				logger('Append Schedule : '+ time);
				res.redirect('/');
			});
		} else {
			res.redirect('/');
		}
	});
	//Update Schedule Data(json)
	app.get('/Update', function(req, res) {
		if (req.query.AMPM !== '' && req.query.hour !== '' && req.query.Minute !== '') {
			fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
				// append Data
				var page = Number(req.query.page);
				var objJson = JSON.parse(data);
				var hour = Number(req.query.AMPM) + Number(req.query.hour);
				var Min = req.query.Minute;
				var time = hour + ':' + Min;
				

				var count = objJson.count;
				if (page >= 0 && page < objJson.time.length) {
					var oldtime = objJson.time[page];
					objJson.time[page] = time;
				
					objJson.count = objJson.time.length;
					fs.writeFile(
						__dirname + '/../data/Setting.json',
						JSON.stringify(objJson, null, '\t'),
						'utf8',
						function(err, data) {}
					);
					logger('Update Schedule : '+ oldtime +' => '+ time);
				}
				bJsonInit= true;
				
				res.redirect('/');
			});
		} else {
			res.redirect('/');
		}
	});
	//delete Schedule Data(json)
	app.get('/DeleteSchedule', function(req, res) {
		{
			fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
				var objJson = JSON.parse(data);
				var page = Number(req.query.page);
				var count = objJson.count;
				if (page >= 0 && page < objJson.time.length) {
					var oldtime = objJson.time[page];
					objJson.time.splice(page, 1);
					objJson.count = objJson.time.length;
					fs.writeFile(
						__dirname + '/../data/Setting.json',
						JSON.stringify(objJson, null, '\t'),
						'utf8',
						function(err, data) {}
					);
					logger('delete Schedule : '+ oldtime);
				}
				bJsonInit= true;
				res.redirect('/');
			});
		}
	});
	//Add Schedule page
	app.get('/AddSchedule', function(req, res) {
		fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
			//console.log( data );
			var objJson = JSON.parse(data);

			res.render('AddSchedule', {
				title: '급식 시간 추가',
				length: objJson.count,
				Time: objJson.time
			});
		});
	});
	//edit Schedule page
	app.get('/EditSchedule', function(req, res) {
		fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
			//console.log( data );

			var objJson = JSON.parse(data);
			var page = Number(req.query.page);
			var ampm;
			var hour;
			var minute;

			if (page >= 0 && page < objJson.time.length) {
				var splitString = String(objJson.time[page]).split(':');
				hour = Number(splitString[0]);
				minute = Number(splitString[1]);
				if (hour > 12) {
					//PM
					ampm = 'PM';
					hour = hour - 12;
				} else {
					ampm = 'AM';
				}

				res.render('editSchedule', {
					title: '급식 시간 수정',
					AMPM: ampm,
					Hour: hour,
					Minute: minute
				});
			}
		});
	});
	// now Feeding Button
	app.get('/FeedingNow', function(req, res) {
		global.Feeding = true;
		res.redirect('/');
	});
	// Check Status from Feeder Device
	app.get('/Status', function(req, res) {
		if (Number(req.query.Status) !== FeederStatus) {
			// 0: disconnect 1:wait 2: feeding
			FeederStatus = Number(req.query.Status);
			//log  Change Status
			logger('Client Status : ' + req.query.Status);
		}
		var FeedingStatus;
		if (global.Feeding === false) {
			FeedingStatus = 0;
		} else {
			if (FeederStatus == 2) {
				//Feeder Move Complete
				global.Feeding = false;
				FeedingStatus = 2;
			} else FeedingStatus = 1; //Feeder need Move
		}
		res.render('Status', { Status: '*' + Number(FeedingStatus) });
		
	});
};