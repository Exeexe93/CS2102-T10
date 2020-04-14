var express = require("express");
var Customer = require("../../models/Customer");

var router = express.Router();

router.get("/", function (req, res) {
  Customer.getRestaurantList(function (err, restaurantList) {
    if (err) return res.json(err);
    return res.json(restaurantList);
  });
});

module.exports = router;
