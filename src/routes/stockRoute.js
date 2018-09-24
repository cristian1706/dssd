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
			if (data) {
				res.json({
					success: true,
					msg: "Producttype insertado",
					data: data
				})
			} else {
				res.status(500).json({
					success: false,
					msg: "Error"
				})
			}
		})
	});
}




