var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');

//middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));

//routes
require('./routes/stockRoute.js')(app);


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});

