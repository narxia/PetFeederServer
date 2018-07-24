module.exports = function(app, fs) {
	app.get('/', function(req, res) {
		fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
			//console.log( data );
			var objJson = JSON.parse(data);

			res.render('index', {
				title: '봄이의 밥그릇',
				length: objJson.count,
				Data: objJson.Data
			});
		});
	});
	app.get('/Append', function(req, res) {
		if (
			req.query.AMPM !== '' &&
			req.query.hour !== '' &&
			req.query.Minute !== '' &&
			req.query.Amount !== ''
		) {
			fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
				// append Data
				var objJson = JSON.parse(data);
				var hour = Number(req.query.AMPM) + Number(req.query.hour);
				var Min = req.query.Minute;
				var time = hour + ':' + Min;
				var amount = Number(req.query.Amount);
				var count = objJson.count;

				console.log(time);
				objJson.Data.push({ time, amount });

				objJson.count = objJson.Data.length;
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
	app.get('/addSchedule', function(req, res) {
		fs.readFile(__dirname + '/../data/' + 'Setting.json', 'utf8', function(err, data) {
			//console.log( data );
			var objJson = JSON.parse(data);

			res.render('AddSchedule', {
				title: '급식 시간 추가',
				length: objJson.count,
				Data: objJson.Data
			});
		});
	});
};