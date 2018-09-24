const stockModel = require('../models/stockModel.js');

module.exports = function(app) {
	
	app.get('/producttypes', (req, res) => {
		stockModel.getProducttypes((err, data) => {
			res.status(200).json(data);
		});
	});

	app.post('/producttypes', (req, res) => {
		const producttypeData = {
			id: null,
			initials: req.body.initials,
			description: req.body.description
		};
		stockModel.insertProducttype(producttypeData, (err, data) => {
			if (data && data.id_insertado) {
				res.json({
					success: true,
					msj: "Producttype insertado",
					data: data
				})
			} else {
				res.status(500).json({
					success: false,
					msj: "Error"
				})
			}
		})
	});

	app.put('/producttypes/:id', (req, res) => {
		const producttypeData = {
			id: req.params.id,
			initials: req.body.initials,
			description: req.body.description
		};
		stockModel.updateProducttype(producttypeData, (err, data) => {
			if (data && data.msj) {
				res.json({
					success: true,
					msj: "Producttype actualizado",
					data: data
				})
			} else {
				res.json({
					success: false,
					msj: "Error"
				})
			}

		})
	})
}




