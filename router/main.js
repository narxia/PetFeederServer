module.exports = function(app, fs,FeederStatus,Feeding) {
	//main Page
	app.get('/', function(req, res) {
		fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
			//console.log( data );
			var objJson = JSON.parse(data);
			
			res.render('index', {
				title: '봄이의 밥그릇',
				length: objJson.count,
				Time: objJson.time,
				Status : FeederStatus
			});
		});
	});
	//Append Schedule Data(json)
	app.get('/Append', function(req, res) {
		if (
			req.query.AMPM !== '' &&
			req.query.hour !== '' &&
			req.query.Minute !== '' 
			
		) {
			fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
				// append Data
				var objJson = JSON.parse(data);
				var hour = Number(req.query.AMPM) + Number(req.query.hour);
				var Min = req.query.Minute;
				var time = hour + ':' + Min;
				
				var count = objJson.count;

				objJson.time.push(time);

				objJson.count = objJson.time.length;
				fs.writeFile(
					__dirname + '/../data/Setting.json',
					JSON.stringify(objJson, null, '\t'),
					'utf8',
					function(err, data) {}
				);
				res.redirect('/');
			});
		}
		else
			{
				res.redirect('/');	
			}
	});
	//Update Schedule Data(json)
	app.get('/Update', function(req, res) {
		if (
			req.query.AMPM !== '' &&
			req.query.hour !== '' &&
			req.query.Minute !== '' 
			
		) {
			fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
				// append Data
				var page =Number(req.query.page); 
				var objJson = JSON.parse(data);
				var hour = Number(req.query.AMPM) + Number(req.query.hour);
				var Min = req.query.Minute;
				var time = hour + ':' + Min;
				
				var count = objJson.count;
				if(page>=0 && page<objJson.time.length)
					{
				objJson.time[page] = time;

				objJson.count = objJson.time.length;
				fs.writeFile(
					__dirname + '/../data/Setting.json',
					JSON.stringify(objJson, null, '\t'),
					'utf8',
					function(err, data) {}
				);
					}
				res.redirect('/');
			});
		}
		else
			{
				res.redirect('/');	
			}
	});
	//delete Schedule Data(json)
	app.get('/DeleteSchedule', function(req, res) {
		 {
			fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
				
				var objJson = JSON.parse(data);
				var page =Number(req.query.page); 				
				var count = objJson.count;
				if(page>=0 && page<objJson.time.length)
					{
				objJson.time.splice(page,1);
				console.log(page);
				console.log(objJson.time);		
				objJson.count = objJson.time.length;
				fs.writeFile(
					__dirname + '/../data/Setting.json',
					JSON.stringify(objJson, null, '\t'),
					'utf8',
					function(err, data) {}
				);
					}
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
			var page =Number(req.query.page); 
			var ampm;
			var hour;
			var minute;
			
			if(page>=0 && page<objJson.time.length)
				{
					var splitString = String(objJson.time[page]).split(':');
					hour = Number(splitString[0]);
					minute = Number(splitString[1]);
					if(hour>12)
						{
							//PM
							ampm = 'PM';	
							hour = hour-12;
						}
					else						
						{
							ampm='AM';
						}

			res.render('editSchedule', {
				title: '급식 시간 수정',
				AMPM: ampm,
				Hour: hour,
				Minute:minute,
			});
				}
		});
	});	
	// now Feeding Button
	app.get('/FeedingNow', function(req, res) {
		Feeding = true;
		res.redirect('/');
	});
	// Check Status from Feeder Device
	app.get('/Status', function(req, res) {
		if(Number(req.query.Status) !== FeederStatus)
			{
				// 0: disconnect 1:wait 2: feeding start 3: feeding complete
				FeederStatus = 	Number(req.query.Status);
				//log  Change Status
				console.log("Status : " + req.query.Status);
			}
		if(req.query.Log !== '')
			{
				//Logging!!! from Feeder
				console.log(req.query.Log);
			}
		res.render('Status',{Status:Feeding});
		console.log(Feeding);
	});
};