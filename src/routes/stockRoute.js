const stockModel = require('../models/stockModel.js');

module.exports = function(app) {
	
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
	});

	app.put('/producttype/:id', (req, res) => {
		const producttypeData = {
			id: req.params.id,
			initials: req.body.initials,
			description: req.body.description
		};
		stockModel.updateProducttype(producttypeData, (err, data) => {
			if (data && data.msj) {
				res.json({
					success: true,
					msj: "Tipo de producto actualizado",
					data: data
				})
			} else {
				res.json({
					success: false,
					msj: "Error al actualizar"
				})
			}

		});
	});

	app.delete('/producttype/:id', (req, res) => {
		stockModel.deleteProducttype(req.params.id, (err, data) => {
			if (data && data.msj === 'deleted') {
				res.json({
					success: true,
					msj: "Tipo de producto eliminado",
					data: data
				})
			} else {
				if (data.msj === 'no existe') {
					res.status(404).json({
						msj: "No existe ese id en la bd"
					})
				} else {
					res.status(500).json({
						msj: "Error al borrar"
					})
				}
			}
		});
	});


	/* ----------------------------------- API DE PRODUCT -----------------------------------*/


	app.get('/product', (req, res) => {
		stockModel.getProducts((err, data) => {
			res.status(200).json(data);
		});
	});

	app.post('/product', (req, res) => {
		const productData = { //NO SE PUEDE INSERTAR POR UN PROBLEMA CON LA CLAVE FORANEA DE PRODUCTTYPE
			id: null,
			name: req.body.name,
			costprice: req.body.costprice,
			saleprice: req.body.saleprice,
			producttype: req.body.producttype
		};
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
			if (data && data.msj) {
				res.json({
					success: true,
					msj: "Producto actualizado",
					data: data
				})
			} else {
				res.json({
					success: false,
					msj: "Error al actualizar"
				})
			}

		});
	});

	app.delete('/product/:id', (req, res) => {
		stockModel.deleteProduct(req.params.id, (err, data) => {
			if (data && data.msj === 'deleted') {
				res.json({
					success: true,
					msj: "Producto eliminado",
					data: data
				})
			} else {
				if (data.msj === 'no existe') {
					res.status(404).json({
						msj: "No existe ese id en la bd"
					})
				} else {
					res.status(500).json({
						msj: "Error al borrar"
					})
				}
			}
		});
	});	
}

