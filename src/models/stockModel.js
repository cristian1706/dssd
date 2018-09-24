var mysql      = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database: "stock"
});


let stockModel = {};

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
		const sql = `
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
					'msj': "success"
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
			console.log(row);
			if (row) {
				let sql = `
					DELETE FROM producttype WHERE id = ${id}
				`;
				connection.query(sql, (err, rows) => {
					if (err) {
						throw err;
					} else {
						callback(null, {
							msj: "deleted"
						})
					}
				})
			} else {
				callback(null, {
					msj: "no existe"
				})
			}
		});
	}
};


module.exports = stockModel;