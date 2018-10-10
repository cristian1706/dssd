var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var morgan = require('morgan');
var partialResponse = require('express-partial-response');


//middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(partialResponse());

//routes
require('./routes/stockRoute.js')(app);
require('./routes/rrhhRoute.js')(app);
require('./routes/couponRoute.js')(app);

var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
	console.log("Listening on Port 3000");
});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

