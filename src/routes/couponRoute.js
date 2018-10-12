const couponModel = require('../models/couponModel.js');

module.exports = function(app) {

	/* ----------------------------------- API DE CUPÓN -----------------------------------*/
  app.get('/coupon', (req,res) => {
    couponModel.getAllCoupons((err,data) => {
      if (err) {
        throw err;
      }
      else {
        res.status(200).json(data);
      }
    })
  });

  app.get('/coupon/:number', (req, res) => {
		let number = req.params.number;
		couponModel.getCouponByNumber(number, (err, data) => {
			if (data.existe == true) {
				res.status(200).json({
					data: data.row
				})
			} else {
				res.status(404).json({
					success: false,
					msj: "No existe ese cupon en la BD"
				})
			}
		});
  });
  
  app.post('/coupon', (req,res) => {
    let couponBody = {
      id: null,
      number: req.body.number,
      used: false,
      initial_date: req.body.initial_date,
      final_date: req.body.final_date,
      discount: req.body.discount
    };
    couponModel.getCouponByNumber(req.body.number, (err,data) => {
      if (data.existe === false){
        couponModel.insertCoupon(couponBody, (err,data) => {
          if (data && data.id_insertado) {
            res.status(200).json({
              success: true,
              msj: "Cupon insertado",
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
          msj: "El cupon ya existe en la BD"
        });
      }
    });
  });

  app.put('/coupon/:number', (req,res) => {
    couponModel.useCoupon(req.params.number, (err,data) => {
      if (data) {
        res.status(200).json({
          success: true,
          msj: "Cupon utilizado con exito",
          data: data
        })
      }
      else {
          res.status(500).json({
            success: false,
            msj: "Error al utilizar el cupon"
          });
        }
      });
    });
      
      
      
}





















