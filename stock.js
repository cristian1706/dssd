//API STOCK

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database: "stock"
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	if (err) throw err;
	console.log('Conexión con la BD establecida!');
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/producttype', function (req, res) {
  connection.query("SELECT * FROM producttype", function (err, result, fields) {
    if (err) throw err;
    res.send(result);
  });
});

//connection.end();
