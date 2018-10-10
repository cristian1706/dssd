var mysql      = require('mysql');

// var connection = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : '1234',
// 	database: "coupon"
// });

var db_config = {
	host     : 'us-cdbr-iron-east-01.cleardb.net',
	user     : 'b9236afe17fd4f',
	password : 'b4e79f55',
	database : "heroku_da2f4d77e00d340"
};

var connection;

function handleDisconnect() {
	connection = mysql.createConnection(db_config);

	connection.connect(function(err) {
		if(err) {
			console.log('error when connecting to db:', err);
			setTimeout(handleDisconnect, 2000);
		}
	});

	connection.on('error', function(err) {
		console.log('db error', err);
		if(err.code === 'PROTOCOL_CONNECTION_LOST') {
			handleDisconnect();
		} else {
			throw err;
		}
	});
}

handleDisconnect();


let couponModel = {};

/* ----------------------------------- MODELO DE CUPÓN ------------------------------------*/





















module.exports = couponModel;