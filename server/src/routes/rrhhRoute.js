const rrhhModel = require('../models/rrhhModel.js');
var jwt = require('jsonwebtoken');

module.exports = function(app) {
	
	/* ----------------------------------- API DE EMPLOYEE -----------------------------------*/

	app.get('/employee', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				let firstname = req.query.firstname;
				let surname = req.query.surname;
				let email = req.query.email;
				let password = req.query.password;
				let employeetype = req.query.employeetype;
				rrhhModel.getEmployees((err, data) => {
					const response = data.filter(c => {
						return (firstname ? (c.firstname === firstname) : true) &&
						(surname ? (c.surname === surname) : true) &&
						(email ? (c.email === email) : true) &&
						(password ? (c.password === password) : true) &&
						(employeetype ? (c.employeetype == employeetype) : true);
					});
					res.status(200).json(response);
				});
			};
		});
	});

	app.get('/employee/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				let id = req.params.id;
				rrhhModel.getEmployeeById(id, (err, data) => {
					if (data.existe == true) {
						res.status(200).json({
							data: data.row
						})
					} else {
						res.status(404).json({
							success: false,
							msj: "No existe ese empleado en la BD"
						})
					}
				});
			};
		});
	});

	app.post('/employee/login', (req, res) => {
		let email = req.body.email;
		let password = req.body.password;
		rrhhModel.authenticateEmployee(email, password, (err, data) => {
			if (data.existe == true) {
				const user = {
					id: data.id,
					email: data.email,
					password: data.password
				}
				jwt.sign({user}, 'ultrasecretkey', {expiresIn: 18000}, (err, token) => { //60x5
					res.status(200).json({
						token: token
					});	
				});
			} else {
				res.status(404).json({
					success: false,
					msj: "El email o la password son incorrectos"
				})
			}
		});
	});

	app.post('/employee', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				const employeeData = {
					id: null,
					firstname: req.body.firstname,
					surname: req.body.surname,
					email: req.body.email,
					password: req.body.password,
					employeetype: req.body.employeetype
				};
				rrhhModel.getEmployeetypeById(req.body.employeetype, (err, data) => {
					if (data.existe == true) {
						rrhhModel.getEmployeeByEmail(employeeData, (err, data) => {
							if (data.existe == false) {
								rrhhModel.insertEmployee(employeeData, (err, data) => {
									if (data && data.id_insertado) {
										res.json({
											success: true,
											msj: "Empleado insertado",
											data: data
										})
									} else {
										res.status(500).json({
											success: false,
											msj: "Error al insertar"
										})
									}
								});
							} else {
								res.status(550).json({
									success: false,
									msj: "El email ya existe en la BD"
								})
							}
						});
					} else {
						res.status(403).json({
							success: false,
							msj: `No existe el id ${req.body.employeetype} de ese tipo de empleado para ser asignado. Por favor, ingrese un tipo de empleado valido`
						})
					}
				});
			};
		});
	});

	app.put('/employee/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				const employeeData = {
					id: req.params.id,
					firstname: req.body.firstname,
					surname: req.body.surname,
					email: req.body.email,
					password: req.body.password,
					employeetype: req.body.employeetype
				};
				rrhhModel.getEmployeetypeById(req.body.employeetype, (err, data) => {
					if (data.existe == true) {
						rrhhModel.updateEmployee(employeeData, (err, data) => {
							if (data && data.msj == 'actualizado') {
								res.status(200).json({
									success: true,
									msj: `Empleado ${req.params.id} actualizado`
								})
							} else {
								if (data.msj == 'no existe') {
									res.status(404).json({
										success: false,
										msj: "No existe ese id en la bd"
									})
								} else {
									if (data.msj == 'email ocupado') {
										res.status(550).json({
											success: false,
											msj: "El email ya existe en la BD"
										}) 
									} else {
										res.status(500).json({
											success: false,
											msj: "Error al actualizar"
										})
									}
								}
							}
						});
					} else {
						res.status(403).json({
							success: false,
							msj: `No existe el id ${req.body.employeetype} de ese tipo de empleado para ser asignado. Por favor, ingrese un tipo de empleado valido`
						})
					}
				});
			};
		});
	});

	app.delete('/employee/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				rrhhModel.deleteEmployee(req.params.id, (err, data) => {
					if (data && data.msj == 'borrado') {
						res.status(200).json({
							success: true,
							msj: `Empleado ${req.params.id} eliminado`,
						})
					} else {
						if (data.msj == 'no existe') {
							res.status(404).json({
								success: false,
								msj: "No existe ese id en la bd"
							})
						} else {
							res.status(500).json({
								success: false,
								msj: "Error al borrar"
							})
						}
					}
				});
			};
		});
	});



	/* ----------------------------------- API DE EMPLOYEETYPE -----------------------------------*/


	app.get('/employeetype', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				let initials = req.query.initials;
				rrhhModel.getEmployeetypes((err, data) => {
					const response = data.filter(c => {
						return (initials ? (c.initials === initials) : true);
					});
					res.status(200).json(response);
				});
			};
		});
	});

	app.get('/employeetype/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				let id = req.params.id;
				rrhhModel.getEmployeetypeById(id, (err, data) => {
					if (data.existe == true) {
						res.status(200).json({
							data: data.row
						})
					} else {
						res.status(404).json({
							success: false,
							msj: "No existe ese tipo de empleado en la BD"
						})
					}
				});
			};
		});
	});

	app.post('/employeetype', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				const employeetypeData = {
					id: null,
					initials: req.body.initials,
					description: req.body.description
				};
				if (employeetypeData.initials.length <= 5) {
					rrhhModel.getEmployeetypeByInitials(employeetypeData, (err, data) => {
						if (data.existe == false) {
							rrhhModel.insertEmployeetype(employeetypeData, (err, data) => {
								if (data && data.id_insertado) {
									res.status(200).json({
										success: true,
										msj: "Tipo de empleado insertado",
										data: data
									})
								} else {
									res.status(500).json({
										success: false,
										msj: "Error al insertar"
									})
								}
							});
						} else {
							res.status(550).json({
								success: false,
								msj: "Las iniciales del tipo de empleado ya existen en la BD"
							})
						}
					});
				} else {
					res.status(403).json({
						success: false,
						msj: "Las iniciales del tipo de empleado deben contener como maximo 5 caracteres"
					})
				}
			};
		});
	});

	app.put('/employeetype/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				const employeetypeData = {
					id: req.params.id,
					initials: req.body.initials,
					description: req.body.description
				};
				if (employeetypeData.initials.length <= 5) {
					rrhhModel.updateEmployeetype(employeetypeData, (err, data) => {
						if (data && data.msj == 'actualizado') {
							res.status(200).json({
								success: true,
								msj: `Tipo de empleado ${req.params.id} actualizado`
							})
						} else {
							if (data.msj == 'no existe') {
								res.status(404).json({
									success: false,
									msj: "No existe ese id en la bd"
								})
							} else {
								if (data.msj == 'iniciales ocupadas') {
									res.status(550).json({
										success: false,
										msj: "Las iniciales del tipo de empleado ya existen en la BD"
									}) 
								} else {
									res.status(500).json({
										success: false,
										msj: "Error al actualizar"
									})
								}
							}
						}
					});
				} else {
					res.status(403).json({
						success: false,
						msj: "Las iniciales del tipo de empleado deben contener como maximo 5 caracteres"
					})
				}
			};
		});
	});

	app.delete('/employeetype/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				rrhhModel.getEmployeeByEmployeetype(req.params.id, (err, data) => {
					if (data.existe == false) {
						rrhhModel.deleteEmployeetype(req.params.id, (err, data) => {
							if (data && data.msj == 'borrado') {
								res.status(200).json({
									success: true,
									msj: `Tipo de empleado ${req.params.id} eliminado`,
								})
							} else {
								if (data.msj == 'no existe') {
									res.status(404).json({
										success: false,
										msj: "No existe ese id en la bd"
									})
								} else {
									res.status(500).json({
										success: false,
										msj: "Error al borrar"
									})
								}
							}
						})
					} else {
						res.status(403).json({
							success: false,
							msj: `El id ${req.params.id} esta asociado a un empleado, primero borra ese empleado o cambia su tipo de empleado por otro`
						})
					}
				});
			};
		});
	});

};


//FUNCTIONS

/*Format of token:
* Authorization: <acces_token>
*/
function verifyToken(req, res, next) {
	//Get auth header value
	const bearerHeader = req.headers['Authorization'];
	//Check if bearer is undefined
	if (typeof bearerHeader !== 'undefined') {
		//Set the token
		req.token = bearerHeader;
		//Next middleware
		next();
	} else {
		//Forbidden
		res.status(403).json({
			msj: "Error de autenticación"
		});
	}
};
