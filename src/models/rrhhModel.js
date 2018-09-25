var mysql      = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database: "rrhh"
});


let rrhhModel = {};

/* ----------------------------------- MODELO DE EMPLOYEE -----------------------------------*/

rrhhModel.getEmployees = (callback) => {
	if (connection) {
		connection.query("SELECT * FROM employee ORDER BY id", (err, rows) => {
			if (err) {
				throw err;
			} else {
				callback(null, rows);
			}
		})
	}
};

rrhhModel.insertEmployee = (employeeData, callback) => {
	if (connection) {
		connection.query("INSERT INTO employee SET ?", employeeData, (err, rows) => {
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

rrhhModel.updateEmployee = (employeeData, callback) => {
	if (connection) {
		const sql = `
			UPDATE employee SET
			firstname = ${connection.escape(employeeData.firstname)},
			surname = ${connection.escape(employeeData.surname)},
			email = ${connection.escape(employeeData.email)},
			password = ${connection.escape(employeeData.password)},
			employeetype = ${connection.escape(employeeData.employeetype)},
			WHERE id =  ${connection.escape(employeeData.id)}
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

rrhhModel.deleteEmployee = (id, callback) => {
	if (connection) {
		let sql = `
			SELECT * FROM employee WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row) {				//CUANDO BORRO UN ID QUE NO EXISTE, INFORMA QUE LO BORRÓ, CORREGIR
				let sql = `
					DELETE FROM employee WHERE id = ${id}
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

/* ----------------------------------- MODELO DE EMPLOYEETYPE ------------------------------------*/

rrhhModel.getEmployeetypes = (callback) => {
	if (connection) {
		connection.query("SELECT * FROM employeetype ORDER BY id", (err, rows) => {
			if (err) {
				throw err;
			} else {
				callback(null, rows);
			}
		})
	}
};

rrhhModel.insertEmployeetype = (employeetypeData, callback) => {
	if (connection) {
		connection.query("INSERT INTO employeetype SET ?", employeetypeData, (err, rows) => {
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

rrhhModel.updateEmployeetype = (employeetypeData, callback) => {
	if (connection) {
		const sql = `
			UPDATE employeetype SET
			initials = ${connection.escape(employeetypeData.initials)},
			description = ${connection.escape(employeetypeData.description)}
			WHERE id =  ${connection.escape(employeetypeData.id)}
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

rrhhModel.deleteEmployeetype = (id, callback) => {
	if (connection) {
		let sql = `
			SELECT * FROM employeetype WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row) {				//CUANDO BORRO UN ID QUE NO EXISTE, INFORMA QUE LO BORRÓ, CORREGIR
				let sql = `
					DELETE FROM employeetype WHERE id = ${id}
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


module.exports = rrhhModel;

