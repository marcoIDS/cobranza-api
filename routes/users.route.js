const {Users, validateUserContent } = require("../models/users.model");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  Users.find({}, function (err, clases) {
    if (err)
      res
        .status(500)
        .send("Error trying to get all info from Users collection");
    res.status(200).send(clases);
  }).sort({$natural:-1});
});
router.get("/:id", async (req, res) => {
  Users.findOne({_id:req.params.id}, function (err, user) {
    if (err)
      res.status(500).send(err);
    console.log(user)
    res.status(200).send(user);
  });
});

router.post("/", async (req, res) => {
  // validate the request body first
  const { error } = validateUserContent(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  user = new Users({
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address
  });
  await user.save();

  res.status(200).send(user);
});

router.put("/:id", async (req, res) => {
  Users.findOneAndUpdate(
    { _id: req.params.id },
    req.body.user,
    function (err, user) {
      if (err) res.status(404).send("user requested for update not found");
      Users.findOne({_id:req.params.id}, function (err, user) {
        if (err)
          res.status(500).send(err);
        console.log(user)
        res.status(200).send(user);
      });
    }
  );
});

router.delete("/", async (req, res) => {
  Users.findOneAndDelete({ _id: req.body.userId }, function (err, user) {
    if (err) res.status(404).send("user requested for deletion not found");
    res.status(200).send(user);
  });
});

module.exports = router;