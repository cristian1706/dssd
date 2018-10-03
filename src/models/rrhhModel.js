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
		let sql = `SELECT * FROM employee WHERE id = ${connection.escape(employeeData.id)}`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				rrhhModel.checkIfEmailExist(employeeData, (err, data) => {
					if (data.existe == false) {
						let sql = `
						UPDATE employee SET
						firstname = ${connection.escape(employeeData.firstname)},
						surname = ${connection.escape(employeeData.surname)},
						email = ${connection.escape(employeeData.email)},
						password = ${connection.escape(employeeData.password)},
						employeetype = ${connection.escape(employeeData.employeetype)}
						WHERE id = ${connection.escape(employeeData.id)}
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
							'msj': "email ocupado"
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

rrhhModel.deleteEmployee = (id, callback) => {
	if (connection) {
		let sql = `
			SELECT * FROM employee WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				let sql = `
					DELETE FROM employee WHERE id = ${id}
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

rrhhModel.getEmployeeByEmail = (employeeData, callback) => {
	if (connection) {
		let sql = `SELECT * FROM employee WHERE email = ${connection.escape(employeeData.email)}`;
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

rrhhModel.getEmployeeByEmployeetype = (id, callback) => {
	if (connection) {
		let sql = `SELECT * FROM employee WHERE employeetype = ${connection.escape(id)}`;
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

rrhhModel.checkIfEmailExist = (employeeData, callback) => {
	if (connection) {
		let sql = `SELECT * FROM employee WHERE email = ${connection.escape(employeeData.email)}
		AND id <> ${connection.escape(employeeData.id)}`;
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
		let sql = `SELECT * FROM employeetype WHERE id = ${connection.escape(employeetypeData.id)}`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				rrhhModel.checkIfInitialsExist(employeetypeData, (err, data) => {
					if (data.existe == false) {
						let sql = `
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

rrhhModel.deleteEmployeetype = (id, callback) => {
	if (connection) {
		let sql = `
			SELECT * FROM employeetype WHERE id = ${connection.escape(id)}
		`;
		connection.query(sql, (err, row) => {
			if (row[0] != null) {
				let sql = `
					DELETE FROM employeetype WHERE id = ${id}
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

rrhhModel.getEmployeetypeByInitials = (employeetypeData, callback) => {
	if (connection) {
		let sql = `SELECT * FROM employeetype WHERE initials = ${connection.escape(employeetypeData.initials)}`;
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

rrhhModel.getEmployeetypeById = (id, callback) => {
	if (connection) {
		let sql = `SELECT * FROM employeetype WHERE id = ${connection.escape(id)}`;
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

rrhhModel.checkIfInitialsExist = (employeetypeData, callback) => {
	if (connection) {
		let sql = `SELECT * FROM employeetype WHERE initials = ${connection.escape(employeetypeData.initials)}
		AND id <> ${connection.escape(employeetypeData.id)}`;
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


module.exports = rrhhModel;

