const rrhhModel = require('../models/rrhhModel.js');

module.exports = function(app) {
	
	/* ----------------------------------- API DE EMPLOYEE -----------------------------------*/

	app.get('/employee', (req, res) => {
		rrhhModel.getEmployees((err, data) => {
			res.status(200).json(data);
		});
	});

	app.get('/employee/:email', (req, res) => {
		const employeeData = {
			email: req.params.email,
		};
		rrhhModel.getEmployeeByEmail(employeeData, (err, data) => {
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
	});

	app.post('/employee', (req, res) => {
		const employeeData = {
			id: null,
			firstname: req.body.firstname,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password,
			employeetype: req.body.employeetype
		};
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
	});

	app.put('/employee/:id', (req, res) => {
		const employeeData = {
			id: req.params.id,
			firstname: req.body.firstname,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password,
			employeetype: req.body.employeetype
		};
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
	});

	app.delete('/employee/:id', (req, res) => {
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
	});



	/* ----------------------------------- API DE EMPLOYEETYPE -----------------------------------*/


	app.get('/employeetype', (req, res) => {
		rrhhModel.getEmployeetypes((err, data) => {
			res.status(200).json(data);
		});
	});

	app.get('/employeetype/:initials', (req, res) => {
		const employeetypeData = {
			initials: req.params.initials,
		};
		rrhhModel.getEmployeetypeByInitials(employeetypeData, (err, data) => {
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
	});

	app.post('/employeetype', (req, res) => {
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
	});

	app.put('/employeetype/:id', (req, res) => {
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
	});

	app.delete('/employeetype/:id', (req, res) => {
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
	});


};
