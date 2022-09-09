const {Prestamos, validatePrestamoContent } = require("../models/prestamos.model");
const {Abonos } = require("../models/abonos.model");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  Prestamos.find({}, function (err, prestamos) {
    if (err)
      res
        .status(500)
        .send("Error trying to get all info from Prestamos collection");
    Prestamos.populate(prestamos, [{path: "usuario"}],function(err, prestamos){
        res.status(200).send(prestamos);
    });
  }).sort({$natural:-1});
});


router.get("/:id", async (req, res) => {
  if (err)
  Prestamos.findOne({_id:req.params.id}, async (err, prestamos) => {
      res.status(500).send(err);
    if(prestamos){
      Prestamos.populate(prestamos, [{path: "usuario"}], function(err, prestamos){
          res.status(200).send(prestamos);
      }); 
    }else{
        res.status(404).send(err);
    }
    
  });
});

router.get("/byUser/:id", async (req, res) => {
  Prestamos.find({usuario: req.params.id}, function (err, prestamos) {
    if (err)
      res.status(500).send(err);
    if(prestamos){
      Prestamos.populate(prestamos, [{path: "usuario"}],async function(err, prestamos){
        let response = JSON.parse(JSON.stringify(prestamos));
        async function asyncForEach(array, callback) {
          for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
          }
        }
        const start = async () => {
          await asyncForEach(response, async (element) => {
            let abonos = await Abonos.find({prestamo: element._id});
            let cantidad_abonada = 0;
            abonos.forEach(element2 => {
              cantidad_abonada += parseFloat(element2.cantidad_abonada);
            });
            element.cantidad_abonada = cantidad_abonada;
            element.abonos = abonos;
          })
        }
        await start();
        res.status(200).send(response);
      }); 
    }else{
        res.status(404).send(err);
    }
    
  }).sort({$natural:-1});;
});

router.post("/", async (req, res) => {
  // validate the request body first
  const { error } = validatePrestamoContent(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  prestamo = new Prestamos({
    usuario: req.body.usuario,
    pago_semanal: req.body.pago_semanal,
    monto_total: req.body.monto_total,
    fecha_desembolso: req.body.fecha_desembolso
  });
  await prestamo.save();

  res.status(200).send({
    _id: prestamo._id,
  });
});

router.put("/:id", async (req, res) => {
  Prestamos.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    function (err, prestamo) {
      if (err) res.status(404).send("prestamo requested for update not found");
      res.status(201).send(prestamo);
    }
  );
});

router.delete("/", async (req, res) => {
  Prestamos.findOneAndDelete({ _id: req.body.claseId }, function (err, prestamo) {
    if (err) res.status(404).send("prestamo requested for deletion not found");
    res.status(200).send(prestamo);
  });
});

module.exports = router;