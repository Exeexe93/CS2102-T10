var express = require("express");
var Customer = require("../models/Customer");

var router = express.Router();

router.get("/", function (req, res) {
  Customer.getRestaurantList(function (err, restaurantList) {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(restaurantList);
  });
});

router.post("/GetRewardPoints", function (req, res) {
  Customer.getRewardPoints(req.body.name, (err, profileInfo) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(profileInfo);
  });
});

router.post("/GetOrders", function (req, res) {
  Customer.getOrders(req.body.cid, (err, orders) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(orders);
  });
});

router.post("/GetCreditCards", function (req, res) {
  Customer.getCreditCards(req.body.cid, (err, cards) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(cards);
  });
});

router.post("/AddCreditCard", function (req, res) {
  Customer.addCreditCard(req.body.cid, req.body.card_number, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/DeleteCreditCard", function (req, res) {
  Customer.deleteCreditCard(req.body.card_number, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/GetRestaurantFoods", function (req, res) {
  Customer.getRestaurantFoods(req.body.restaurantName, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/AddOrder", function (req, res) {
  Customer.addOrder(req.body.rest_id, req.body.order_status, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/PlaceOrder", function (req, res) {
  Customer.placeOrder(req.body.oid, req.body.cid, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/AddFood", function (req, res, next) {
  Customer.addFood(
    req.body.oid,
    req.body.fid,
    req.body.quantity,
    req.body.total_price,
    (err, result) => {
      if (err.error) {
        return res.send(err.error);
      }
      return res.json(result);
    }
  );
});

router.post("/GetCartOrder", function (req, res) {
  Customer.getCartOrder(req.body.cid, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/DeleteFood", function (req, res) {
  Customer.deleteFood(req.body.oid, req.body.fid, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/UpdateFood", function (req, res) {
  Customer.updateFood(
    req.body.oid,
    req.body.fid,
    req.body.quantity,
    req.body.total_price,
    (err, result) => {
      if (err.error) return res.send(err.error);
      return res.status(200).json(result);
    }
  );
});

router.post("/UpdateOrder", function (req, res) {
  Customer.updateOrder(
    req.body.queryList,
    req.body.valueList,
    (err, result) => {
      if (err.error) return res.status(404).json(err);
      return res.status(200).json(result);
    }
  );
});

router.post("/GetTopFiveCreditCards", function (req, res) {
  Customer.getTopFiveCreditCards(req.body.cid, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/GetFiveRecentDeliveryLocations", function (req, res) {
  Customer.getFiveRecentDeliveryLocations(req.body.cid, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/DeleteOrder", function (req, res) {
  Customer.deleteOrder(req.body.oid, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/CheckOrderExists", function (req, res) {
  Customer.checkOrderExists(req.body.cid, req.body.rest_id, (err, result) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(result);
  });
});

router.post("/UpdateRatingAndReview", function (req, res) {
  Customer.updateRatingAndReview(
    req.body.queryList,
    req.body.valueList,
    (err, result) => {
      if (err.error) return res.status(404).json(err);
      return res.status(200).json(result);
    }
  );
});

module.exports = router;
