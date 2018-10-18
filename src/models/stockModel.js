var mysql      = require('mysql');

var db_config = {
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database: "stock"
};

// var db_config = {
// 	host     : 'us-cdbr-iron-east-01.cleardb.net',
// 	user     : 'bf594d14cc0415',
// 	password : 'c44ea089',
// 	database : "gcp_b5009f6f961b73a32817"
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
    productData.saleprice = calculateDiscountFromSalePrice(productData.saleprice, productData.costprice);
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
/*
* calculateDiscountFromSalePrice calcula la diferencia entre el
* precio de venta y precio de compra, donde si supera el margen
* del 10% tiene que aplicarse un descuento al excedente
*
* @return integer
*/
let calculateDiscountFromSalePrice = (productSalePrice, productCostPrice) => {
  //margin guarda el 10% del costo del producto (productCostPrice)
  let margin = productCostPrice * 0.1;
  let difference = productSalePrice - productCostPrice;
  if ( difference > margin ) {
    //surplus = excendente (google translate)
    let surplus = difference - margin;

    //80% del excedente
    surplus = surplus * 0.8;

    //le resto al saleprice el surplus calculado (80% de la diferencia del 10%)
    return productSalePrice - surplus;
  }
  else {
    return productSalePrice
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