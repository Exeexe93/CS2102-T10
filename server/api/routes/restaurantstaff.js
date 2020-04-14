var express = require('express');
const RestaurantStaff = require("../../models/RestaurantStaff.js");
var router = express.Router();

router.get('/', function(req, res) {
    RestaurantStaff.getFoodItems((err, foodItems) => {
      if (err) return res.json(err);
      return res.json(foodItems);
    });
  });

  router.post("/", (request, response) => {
    let name = request.body.name;
    let price = request.body.price;
    let food_limit = parseInt(request.body.food_limit);
    let quantity = parseInt(request.body.quantity);
    let category = request.body.category;
    RestaurantStaff.addFood(name, price, food_limit, quantity, category, (err, result) => {
      if (err) {
        return response.json(err);
      }
      return response.json(result);
    });
  });
  
  

module.exports = router;