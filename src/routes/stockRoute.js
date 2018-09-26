const stockModel = require('../models/stockModel.js');

module.exports = function(app) {
	
	/* ----------------------------------- API DE PRODUCT -----------------------------------*/

	app.get('/product', (req, res) => {
		stockModel.getProducts((err, data) => {
			res.status(200).json(data);
		});
	});

	app.post('/product', (req, res) => {
		const productData = {
			id: null,
			name: req.body.name,
			costprice: req.body.costprice,
			saleprice: req.body.saleprice,
			producttype: req.body.producttype
		};
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
	});

	app.put('/product/:id', (req, res) => {
		const productData = {
			id: req.params.id,
			name: req.body.name,
			costprice: req.body.costprice,
			saleprice: req.body.saleprice,
			producttype: req.body.producttype
			
		};
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
	});

	app.delete('/product/:id', (req, res) => {
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
	});


	/* ----------------------------------- API DE PRODUCTTYPE -----------------------------------*/


	app.get('/producttype', (req, res) => {
		stockModel.getProducttypes((err, data) => {
			res.status(200).json(data);
		});
	});

	app.post('/producttype', (req, res) => {
		const producttypeData = {
			id: null,
			initials: req.body.initials,
			description: req.body.description
		};
		stockModel.getproducttypeByInitials(producttypeData, (err, data) => {
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
	});

	app.put('/producttype/:id', (req, res) => {
		const producttypeData = {
			id: req.params.id,
			initials: req.body.initials,
			description: req.body.description
		};
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
	});

	app.delete('/producttype/:id', (req, res) => {
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
	});

	
};

