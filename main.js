const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.static(__dirname +'/template'));
app.get('/', (req, res) => {
	
  //res.send('Hello World!');
      
      fs.readFile(__dirname+'/template/index.html','utf8', (err, data) => {
        if (err) {
			console.log('ERROR!!!!!!');
          return console.error(err);
        }
		  //console.log(data);
		  console.log(__dirname+'template');
		  
        //res.send(data);
		  res.render(__dirname+'/template/index.html');
      });	
	  
});
app.listen(3000, () => {
  console.log('Express App on port 3000!');
});