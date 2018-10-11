var mysql      = require('mysql');

var db_config = {
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database: "coupon"
};

// var db_config = {
// 	host     : 'us-cdbr-iron-east-01.cleardb.net',
// 	user     : 'b60adfc4f9b112',
// 	password : '4b9ce5de',
// 	database : "gcp_97d3f6e75da6abe1fc08"
// };

var connection;

function handleDisconnect() {
	connection = mysql.createConnection(db_config);

	connection.connect(function(err) {
		if(err) {
			console.log('error when connecting to db:', err);
			setTimeout(handleDisconnect, 10000);
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