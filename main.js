const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(express.static(__dirname +'/template'));
app.set('views',__dirname+'views');
app.set('view engine','ejs');
app.get('/', (req, res) => {
	
  
      
      fs.readFile(__dirname+'/template/index.html','utf8', (err, data) => {
        if (err) {
			console.log('ERROR!!!!!!');
          return console.error(err);
        }		  
        //res.send(data);
		  res.render(__dirname+'/template/index.html');
      });	
	  
});
app.listen(3000, () => {
  console.log('Express App on port 3000!');
});