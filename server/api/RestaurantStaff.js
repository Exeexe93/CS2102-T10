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

router.post("/updateProfile", (request, response) => {
  const rest_id = request.body.rest_id;
  const name = request.body.name;
  const order_threshold = request.body.order_threshold;
  const address = request.body.address;
  RestaurantStaff.updateProfile(rest_id, name, order_threshold, address, (err, result) => {
    if (err) {
      return response.json(err);
    }
    return response.json(result);
  });
});

router.post("/addPromo", (request, response) => {
  const creator_id = request.body.creator_id;
  const details = request.body.details;
  const category = request.body.category;
  const promo_type = request.body.promo_type;
  const discount_value = request.body.discount_value;
  const trigger_value = request.body.trigger_value;
  const start_time = request.body.start_time;
  const end_time = request.body.end_time;
  RestaurantStaff.addPromo(creator_id, details, category, promo_type, discount_value, trigger_value, start_time, end_time, (err, result) => {
    if (err) {
      return response.json(err);
    }
    return response.json(result);
  });
});

router.post("/getPromo", (request, response) => {
  RestaurantStaff.getPromo(request.body.rest_id, (error, result) => {
    if (error) {
      return response.json(error);
    }
    return response.json(result);
  });
});

module.exports = router;
