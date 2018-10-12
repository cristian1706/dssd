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

couponModel.getAllCoupons = (callback) => {
	if (connection) {
		connection.query("SELECT * FROM coupon ORDER BY id", (err, rows) => {
			if (err) {
				throw err;
			} else {
				callback(null, rows);
			}
		})
	}
};

couponModel.getCouponByNumber = (number, callback) => {
	if (connection) {
		let sql = `SELECT * FROM coupon WHERE number = ${connection.escape(number)}`;
		connection.query(sql, (err, rows) => {
			if (err) {
				throw err;
			} else {
				if (rows[0] == null) {
					callback(null, {
						'existe': false
					});
				} else {
					callback(null, {
						'existe': true,
						'row': rows
					});
				}
			}
		})
	}
};

couponModel.getCouponsByDates = (initialDate, finalDate, callback) => {
	if (connection) {
		let sql = `SELECT * FROM coupon WHERE initial_date <= ${connection.escape(initialDate)} AND final_date >= ${connection.escape(finalDate)}`;
		connection.query(sql, (err, rows) => {
			if (err) {
				throw err;
			} else {
				if (rows[0] == null) {
					callback(null, {
						'existe': false
					});
				} else {
					callback(null, {
						'existe': true,
						'row': rows
					});
				}
			}
		})
	}
};

couponModel.insertCoupon = (couponBody, callback) => {
  if (connection) {
		connection.query("INSERT INTO coupon SET ?", couponBody, (err, row) => {
			if (err) {
				throw err;
			} else {
				callback(null, {
					'id_insertado': row.insertId
				});
			}
		})
	}
}

couponModel.useCoupon = (number, callback) => {
  if (connection) {
    let sql = (`UPDATE coupon SET used = 1 WHERE number = ${connection.escape(number)}`);
    connection.query(sql, (err, data) => {
        if (err) {
          throw err;
        } else {
          callback(null, {
            'msj': "actualizado"
          });
        }
      })
  }
}



















module.exports = couponModel;