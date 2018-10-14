var mysql      = require('mysql');

var db_config = {
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database: "coupons"
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

couponModel.getCoupons = (callback) => {
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

couponModel.getCouponByid = (id, callback) => {
	if (connection) {
		let sql = `SELECT * FROM coupon WHERE id = ${connection.escape(id)}`;
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

couponModel.getCouponByNumber = (couponNumber, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM coupon WHERE number = ${connection.escape(couponNumber)}`;
		connection.query(sql, (err, rows) => {
			if (err) {
				throw err;
			} else {
				if (rows[0] == null){
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

couponModel.getCouponByDate = (initial_date, callback) => {
	if (connection) {
		let sql = `SELECT * FROM coupon WHERE initial_date = ${connection.escape(initial_dDate)}`;
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
};

couponModel.updateCoupon = (couponData, callback) => {
	if (connection) {
		let sql = `SELECT * FROM coupon WHERE id = ${connection.escape(couponData.id)}`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				couponModel.checkIfNumberExist(couponData, (err, data) => {
					if (data.existe == false) {
						let sql = `
						UPDATE coupon SET
						number = ${connection.escape(couponData.number)},
						initial_date = ${connection.escape(couponData.initial_date)},
						discount = ${connection.escape(couponData.discount)}
						WHERE id =  ${connection.escape(couponData.id)}
						`;
						connection.query(sql, (err, rows) => {
							if (err) {
								throw err;
							} else {
								callback(null, {
									'msj': "actualizado"
								});
							}
						})
					} else {
						callback(null, {
							'msj': "numero ocupado"
						});
					}
				});
			} else {
				callback(null, {
					'msj': "no existe"
				})
			}
		})
	}
};

couponModel.useCoupon = (id, callback) => {
	if (connection) {
		let sql = (`UPDATE coupon SET used = 1 WHERE id = ${connection.escape(id)}`);
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
};

couponModel.deleteCoupon = (id, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM coupon WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				let sql = `
				DELETE FROM coupon WHERE id = ${id}
				`;
				connection.query(sql, (err, rows) => {
					if (err) {
						throw err;
					} else {
						callback(null, {
							msj: "borrado"
						})
					}
				})
			} else {
				callback(null, {
					'msj': "no existe"
				})
			}
		});
	}
};

couponModel.checkIfNumberExist = (couponData, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM coupon WHERE number = ${connection.escape(couponData.number)}
		AND id <> ${connection.escape(couponData.id)}`;
		connection.query(sql, (err, rows) => {
			if (err) {
				throw err;
			} else {
				if (rows[0] == null){
					callback(null, {
						'existe': false
					});
				} else {
					callback(null, {
						'existe': true
					});
				}
			}
		})
	}
};

couponModel.checkIfCouponAlreadyUsed = (id, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM coupon WHERE used = 1 AND id = ${connection.escape(id)}`;
		connection.query(sql, (err, rows) => {
			if (err) {
				throw err;
			} else {
				if (rows[0] == null){
					callback(null, {
						'usado': false
					});
				} else {
					callback(null, {
						'usado': true
					});
				}
			}
		})
	}
};



module.exports = couponModel;