const stockModel = require('../models/stockModel.js');

module.exports = function(app) {
	
	/* ----------------------------------- API DE PRODUCT -----------------------------------*/

	app.get('/product', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				let name = req.query.name;
				let costprice = req.query.costprice;
				let saleprice = req.query.saleprice;
				let producttype = req.query.producttype;
				stockModel.getProducts((err, data) => {
					const response = data.filter(c => {
						return (name ? (c.name === name) : true) &&
						(costprice ? (c.costprice == costprice) : true) &&
						(saleprice ? (c.saleprice == saleprice) : true) &&
						(producttype ? (c.producttype == producttype) : true);
					});
					res.status(200).json(response);
				});
			};
		});
	});

	app.get('/product/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				let id = req.params.id;
				stockModel.getProductById(id, (err, data) => {
					if (data.existe == true) {
						res.status(200).json({
							data: data.row
						})
					} else {
						res.status(404).json({
							success: false,
							msj: "No existe ese producto en la BD"
						})
					}
				});
			}:
		});
	});

	app.post('/product', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				const productData = {
					id: null,
					name: req.body.name,
					costprice: req.body.costprice,
					saleprice: req.body.saleprice,
					producttype: req.body.producttype
				};
				stockModel.getProducttypeById(req.body.producttype, (err, data) => {
					if (data.existe == true) {
						stockModel.getProductByName(productData, (err, data) => {
							if (data.existe == false) {
								stockModel.insertProduct(productData, (err, data) => {
									if (data && data.id_insertado) {
										res.json({
											success: true,
											msj: "Producto insertado",
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
									msj: "El nombre de producto ya existe en la BD"
								})
							}
						});
					} else {
						res.status(403).json({
							success: false,
							msj: `No existe el id ${req.body.producttype} de ese tipo de producto para ser asignado. Por favor, ingrese un tipo de producto valido`
						})
					}
				});
			};
		});
	});

	app.put('/product/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				const productData = {
					id: req.params.id,
					name: req.body.name,
					costprice: req.body.costprice,
					saleprice: req.body.saleprice,
					producttype: req.body.producttype

				};
				stockModel.getProducttypeById(req.body.producttype, (err, data) => {
					if (data.existe == true) {
						stockModel.updateProduct(productData, (err, data) => {
							if (data && data.msj == 'actualizado') {
								res.json({
									success: true,
									msj: `Producto ${req.params.id} actualizado`
								})
							} else {
								if (data.msj == 'no existe') {
									res.status(404).json({
										success: false,
										msj: "No existe ese id en la bd"
									})
								} else {
									if (data.msj == 'nombre ocupado') {
										res.status(550).json({
											success: false,
											msj: "El nombre de producto ya existe en la BD"
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
							msj: `No existe el id ${req.body.producttype} de ese tipo de producto para ser asignado. Por favor, ingrese un tipo de producto valido`
						})
					}
				});
			}:
		});
	});

	app.delete('/product/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				stockModel.deleteProduct(req.params.id, (err, data) => {
					if (data && data.msj == 'borrado') {
						res.json({
							success: true,
							msj: `Producto ${req.params.id} eliminado`,
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


	/* ----------------------------------- API DE PRODUCTTYPE -----------------------------------*/


	app.get('/producttype', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				let initials = req.query.initials;
				stockModel.getProducttypes((err, data) => {
					const response = data.filter(c => {
						return (initials ? (c.initials === initials) : true);
					});
					res.status(200).json(response);
				});
			};
		});
	});

	app.get('/producttype/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				let id = req.params.id;
				stockModel.getProducttypeById(id, (err, data) => {
					if (data.existe == true) {
						res.status(200).json({
							data: data.row
						})
					} else {
						res.status(404).json({
							success: false,
							msj: "No existe ese tipo de producto en la BD"
						})
					}
				});
			};
		});
	});

	app.post('/producttype', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				const producttypeData = {
					id: null,
					initials: req.body.initials,
					description: req.body.description
				};
				if (producttypeData.initials.length <= 5) {
					stockModel.getProducttypeByInitials(producttypeData, (err, data) => {
						if (data.existe == false) {
							stockModel.insertProducttype(producttypeData, (err, data) => {
								if (data && data.id_insertado) {
									res.json({
										success: true,
										msj: "Tipo de producto insertado",
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
								msj: "Las iniciales del tipo de producto ya existen en la BD"
							})
						}
					});
				} else {
					res.status(403).json({
						success: false,
						msj: "Las iniciales del tipo de producto deben contener como maximo 5 caracteres"
					})
				}
			};
		});
	});

	app.put('/producttype/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				const producttypeData = {
					id: req.params.id,
					initials: req.body.initials,
					description: req.body.description
				};
				if (producttypeData.initials.length <= 5) {
					stockModel.updateProducttype(producttypeData, (err, data) => {
						if (data && data.msj == 'actualizado') {
							res.json({
								success: true,
								msj: `Tipo de producto ${req.params.id} actualizado`
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
										msj: "Las iniciales del tipo de producto ya existen en la BD"
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
						msj: "Las iniciales del tipo de producto deben contener como maximo 5 caracteres"
					})
				}
			};
		});
	});

	app.delete('/producttype/:id', verifyToken, (req, res) => {
		jwt.verify(req.token, 'ultrasecretkey', (err, authData) => {
			if (err) {
				res.status(403).json({
					success: false,
					msj: "Error de autenticación"
				});
			} else {
				stockModel.getProductByProducttype(req.params.id, (err, data) => {
					if (data.existe == false) {
						stockModel.deleteProducttype(req.params.id, (err, data) => {
							if (data && data.msj == 'borrado') {
								res.json({
									success: true,
									msj: `Tipo de producto ${req.params.id} eliminado`,
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
					} else {
						res.status(403).json({
							success: false,
							msj: `El id ${req.params.id} esta asociado a un producto, primero borra ese producto o cambia su tipo de producto por otro`
						})
					}
				})
			};
		});
	});

	
};

