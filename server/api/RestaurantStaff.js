const express = require("express");
const RestaurantStaff = require("../models/RestaurantStaff.js");

const router = express.Router();

router.get("/", (req, res) => {
  RestaurantStaff.getFoodItems((err, foodItems) => {
    if (err) return res.json(err);
    return res.json(foodItems);
  });
});

router.post("/", (request, response) => {
    const name = request.body.name;
    const price = request.body.price;
    const food_limit = request.body.food_limit;
    const quantity = request.body.quantity;
    const category = request.body.category;
    RestaurantStaff.addFood(name, price, food_limit, quantity, category, (err, result) => {
      if (err) {
        return response.json(err);
      }
      return response.json(result);
    });
  });

module.exports = router;
