var express = require("express");
var Customer = require("../models/Customer");

var router = express.Router();

router.get("/", function (req, res) {
  Customer.getRestaurantList(function (err, restaurantList) {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(restaurantList);
  });
});

router.post("/Profile", function (req, res) {
  const name = req.body.name;
  Customer.getProfile(name, (err, profileInfo) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(profileInfo);
  });
});

module.exports = router;
