var mysql      = require('mysql');

// var connection = mysql.createConnection({
// 	host     : 'localhost',
// 	user     : 'root',
// 	password : '1234',
// 	database: "stock"
// });

var db_config = {
	host     : 'us-cdbr-iron-east-01.cleardb.net',
	user     : 'b9236afe17fd4f',
	password : 'b4e79f55',
	database : "heroku_da2f4d77e00d340"
};

var connection;

function handleDisconnect() {
  connection = mysql.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.
  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();


let stockModel = {};

/* ----------------------------------- MODELO DE PRODUCT -----------------------------------*/

stockModel.getProducts = (callback) => {
	if (connection) {
		connection.query("SELECT * FROM product ORDER BY id", (err, rows) => {
			if (err) {
				throw err;
			} else {
				callback(null, rows);
			}
		})
	}
};

stockModel.insertProduct = (productData, callback) => {
	if (connection) {
		connection.query("INSERT INTO product SET ?", productData, (err, rows) => {
			if (err) {
				throw err;
			} else {
				callback(null, {
					'id_insertado': rows.insertId
				});
			}
		})
	}
};

stockModel.updateProduct = (productData, callback) => {
	if (connection) {
		let sql = `SELECT * FROM product WHERE id = ${connection.escape(productData.id)}`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				stockModel.checkIfNameExist(productData, (err, data) => {
					if (data.existe == false) {
						let sql = `
						UPDATE product SET
						name = ${connection.escape(productData.name)},
						costprice = ${connection.escape(productData.costprice)},
						saleprice = ${connection.escape(productData.saleprice)},
						producttype = ${connection.escape(productData.producttype)}
						WHERE id =  ${connection.escape(productData.id)}
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
							'msj': "nombre ocupado"
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

stockModel.deleteProduct = (id, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM product WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				let sql = `
				DELETE FROM product WHERE id = ${id}
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

stockModel.checkIfNameExist = (productData, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM product WHERE name = ${connection.escape(productData.name)}
		AND id <> ${connection.escape(productData.id)}`;
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

stockModel.getProductByName = (productData, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM product WHERE name = ${connection.escape(productData.name)}`;
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

stockModel.getProductByProducttype = (id, callback) => {
	if (connection) {
		let sql = `SELECT * FROM product WHERE producttype = ${connection.escape(id)}`;
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

stockModel.getProductById = (id, callback) => {
	if (connection) {
		let sql = `SELECT * FROM product WHERE id = ${connection.escape(id)}`;
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

/* ----------------------------------- MODELO DE PRODUCTTYPE ------------------------------------*/


stockModel.getProducttypes = (callback) => {
	if (connection) {
		connection.query("SELECT * FROM producttype ORDER BY id", (err, rows) => {
			if (err) {
				throw err;
			} else {
				callback(null, rows);
			}
		})
	}
};

stockModel.insertProducttype = (producttypeData, callback) => {
	if (connection) {
		connection.query("INSERT INTO producttype SET ?", producttypeData, (err, rows) => {
			if (err) {
				throw err;
			} else {
				callback(null, {
					'id_insertado': rows.insertId
				});
			}
		})
	}
};

stockModel.updateProducttype = (producttypeData, callback) => {
	if (connection) {
		let sql = `SELECT * FROM producttype WHERE id = ${connection.escape(producttypeData.id)}`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				stockModel.checkIfInitialsExist(producttypeData, (err, data) => {
					if (data.existe == false) {
						let sql = `
						UPDATE producttype SET
						initials = ${connection.escape(producttypeData.initials)},
						description = ${connection.escape(producttypeData.description)}
						WHERE id =  ${connection.escape(producttypeData.id)}
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
							'msj': "iniciales ocupadas"
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

stockModel.deleteProducttype = (id, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM producttype WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				let sql = `
				DELETE FROM producttype WHERE id = ${id}
				`;
				connection.query(sql, (err, rows) => {
					if (err) {
						throw err;
					} else {
						callback(null, {
							'msj': "borrado"
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

stockModel.getProducttypeByInitials = (producttypeData, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM producttype WHERE initials = ${connection.escape(producttypeData.initials)}`;
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

stockModel.getProducttypeById = (id, callback) => {
	if (connection) {
		let sql = `SELECT * FROM producttype WHERE id = ${connection.escape(id)}`;
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

stockModel.checkIfInitialsExist = (producttypeData, callback) => {
	if (connection) {
		let sql = `
		SELECT * FROM producttype WHERE initials = ${connection.escape(producttypeData.initials)}
		AND id <> ${connection.escape(producttypeData.id)}`;
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


module.exports = stockModel;