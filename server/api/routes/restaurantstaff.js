var express = require('express');
const RestaurantStaff = require("../../models/RestaurantStaff.js");
var router = express.Router();

router.get('/', function(req, res) {
    RestaurantStaff.getFoodItems((err, foodItems) => {
      if (err) return res.json(err);
      return res.json(foodItems);
    });
  });

module.exports = router;