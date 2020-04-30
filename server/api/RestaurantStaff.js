const express = require("express");
const RestaurantStaff = require("../models/RestaurantStaff.js");

const router = express.Router();

router.post("/getRestaurantStaffDetails", (request, response) => {
  RestaurantStaff.getRestaurantStaffDetails(request.body.staff_id, (error, result) => {
    if (error) {
      return response.json(error);
    }
    return response.json(result);
  });
});

router.post("/getFoodItems", (request, response) => {
  RestaurantStaff.getFoodItems(request.body.rest_id, (error, result) => {
    if (error) {
      return response.json(error);
    }
    return response.json(result);
  });
});

router.post("/addFood", (request, response) => {
    const rest_id = request.body.rest_id;
    const name = request.body.name;
    const price = request.body.price;
    const food_limit = request.body.food_limit;
    const quantity = request.body.quantity;
    const category = request.body.category;
    RestaurantStaff.addFood(rest_id, name, price, food_limit, quantity, category, (err, result) => {
      if (err) {
        return response.json(err);
      }
      return response.json(result);
    });
  });

router.post("/deleteFood", (request, response) => {
  RestaurantStaff.deleteFood(request.body.fid, (err, result) => {
    if (err) {
      return response.json(err);
    }
    return response.json(result);
  });
});

router.post("/getNumOfOrders", (request, response) => {
  RestaurantStaff.getNumOfOrders(request.body.rest_id, (err, result) => {
    if (err) {
      return response.json(err);
    }
    return response.json(result);
  });
});

router.post("/getTopItems", (request, response) => {
  RestaurantStaff.getTopItems(request.body.rest_id, (err, result) => {
    if (err) {
      return response.json(err);
    }
    return response.json(result);
  });
});

module.exports = router;
