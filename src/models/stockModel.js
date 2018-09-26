var mysql      = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database: "stock"
});


let stockModel = {};

/* ----------------------------------- MODELO DE PRODUCTTYPE -----------------------------------*/

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
	}
};

stockModel.deleteProducttype = (id, callback) => {
	if (connection) {
		let sql = `
			SELECT * FROM producttype WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row) {
				let sql = `
					DELETE FROM producttype WHERE id = ${id}
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

/* ----------------------------------- MODELO DE PRODUCT ------------------------------------*/

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
	}
};

stockModel.deleteProduct = (id, callback) => {
	if (connection) {
		let sql = `
			SELECT * FROM product WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row) {
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


module.exports = stockModel;