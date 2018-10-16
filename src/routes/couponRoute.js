const couponModel = require('../models/couponModel.js');

module.exports = function(app) {

	/* ----------------------------------- API DE CUPÓN -----------------------------------*/
	app.get('/coupon', (req,res) => {
		let number = req.query.number;
		let used = req.query.used;
		let initial_date = req.query.initial_date;
		let discount = req.query.discount;
		couponModel.getCoupons((err,data) => {
			const response = data.filter(c => {
				return (number ? (c.number === number) : true) &&
				(used ? (c.used === used) : true) &&
				(initial_date ? (c.initial_date === initial_date) : true) &&
				(discount ? (c.discount === discount) : true);
			});
			res.status(200).json(response);
		})
	});

	app.get('/coupon/:id', (req, res) => {
		let id = req.params.id;
		couponModel.getCouponByid(id, (err, data) => {
			if (data.existe == true) {
				res.status(200).json({
					data: data.row
				})
			} else {
				res.status(404).json({
					success: false,
					msj: "No existe ese cupón en la BD"
				})
			}
		});
	});

	app.post('/coupon', (req,res) => {
		let couponData = {
			id: null,
			number: req.body.number,
			used: false,
			initial_date: req.body.initial_date,
			discount: req.body.discount
		};
		couponModel.getCouponByNumber(req.body.number, (err,data) => {
			if (data.existe === false){
				couponModel.insertCoupon(couponData, (err,data) => {
					if (data && data.id_insertado) {
						res.status(200).json({
							success: true,
							msj: "Cupón insertado",
							data: data
						});
					} else {
						res.status(500).json({
							success: false,
							msj: "Error al insertar"
						});
					}
				});
			} else {
				res.status(550).json({
					success: false,
					msj: "El cupón ya existe en la BD"
				});
			}
		});
	});

	app.put('/coupon/:id', (req, res) => {
		const couponData = {
			id: req.params.id,
			number: req.body.number,
			initial_date: req.body.initial_date,
			discount: req.body.discount
		};
		couponModel.updateCoupon(couponData, (err, data) => {
			if (data && data.msj == 'actualizado') {
				res.json({
					success: true,
					msj: `Cupón ${req.params.id} actualizado`
				})
			} else {
				if (data.msj == 'no existe') {
					res.status(404).json({
						success: false,
						msj: "No existe ese id en la bd"
					})
				} else {
					if (data.msj == 'numero ocupado') {
						res.status(550).json({
							success: false,
							msj: "El número de cupón ya existe en la BD"
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

	app.put('/coupon/usar/:id', (req,res) => {
		couponModel.getCouponByid(req.params.id, (err, data) => {
			if (data.existe == true) {
				couponModel.checkIfCouponAlreadyUsed(req.params.id, (err, data) => {
					if (data.usado == false) {
						couponModel.useCoupon(req.params.id, (err,data) => {
							if (data) {
								res.status(200).json({
									success: true,
									msj: "Cupón usado con exito",
								})
							}
							else {
								res.status(500).json({
									success: false,
									msj: "Error al usar el cupón"
								});
							}
						});
					} else {
						res.status(403).json({
							success: false,
							msj: "Ese cupón ya está siendo usado"
						})
					}
				});
			} else {
				res.status(404).json({
					success: false,
					msj: "No existe ese id en la bd"
				})
			}
		});
	});

	app.delete('/coupon/:id', (req, res) => {
		couponModel.deleteCoupon(req.params.id, (err, data) => {
			if (data && data.msj == 'borrado') {
				res.json({
					success: true,
					msj: `Cupón ${req.params.id} eliminado`,
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

