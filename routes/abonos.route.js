const {Abonos, validateAbonoContent } = require("../models/abonos.model");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  Abonos.find({}, function (err, abonos) {
    if (err)
      res
        .status(500)
        .send("Error trying to get all info from Abonos collection");
    Abonos.populate(abonos, [{path: "prestamo"}],function(err, abonos){
        res.status(200).send(abonos);
    });
  }).sort({$natural:-1});
});
router.get("/:id", async (req, res) => {
  Abonos.findOne({_id:req.params.id}, function (err, abonos) {
    if (err)
      res.status(500).send(err);
    if(abonos){
       Abonos.populate(abonos, [{path: "prestamo"}],function(err, abonos){
            res.status(200).send(abonos);
        }); 
    }else{
        res.status(404).send(err);
    }
    
  });
});

router.get("/byPrestamo/:id", async (req, res) => {
    Abonos.find({prestamo:req.params.id}, function (err, abonos) {
      if (err)
        res.status(500).send(err);
      if(abonos){
         Abonos.populate(abonos, [{path: "prestamo"}],function(err, abonos){
              res.status(200).send(abonos);
          }); 
      }else{
          res.status(404).send(err);
      }
      
    });
  });

router.post("/", async (req, res) => {
  // validate the request body first
  const { error } = validateAbonoContent(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  abono = new Abonos({
    prestamo: req.body.prestamo,
    cantidad_abonada: req.body.cantidad_abonada,
    fecha_abono: req.body.fecha_abono
  });
  await abono.save();

  res.status(200).send({
    _id: abono._id,
  });
});

router.put("/:id", async (req, res) => {
  Abonos.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    function (err, abono) {
      if (err) res.status(404).send("abono requested for update not found");
      res.status(201).send(abono);
    }
  );
});

router.delete("/", async (req, res) => {
  Abonos.findOneAndDelete({ _id: req.body.claseId }, function (err, abono) {
    if (err) res.status(404).send("abono requested for deletion not found");
    res.status(200).send(abono);
  });
});

module.exports = router;