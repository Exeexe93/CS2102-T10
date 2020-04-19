var express = require("express");
var Customer = require("../models/Customer");

var router = express.Router();

router.get("/", function (req, res) {
  Customer.getRestaurantList(function (err, restaurantList) {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(restaurantList);
  });
});

router.post("/GetProfile", function (req, res) {
  const name = req.body.name;
  Customer.getProfile(name, (err, profileInfo) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(profileInfo);
  });
});

router.post("/GetOrders", function (req, res) {
  const cid = req.body.cid;
  Customer.getOrders(cid, (err, orders) => {
    if (err.error) return res.status(404).json(err);
    return res.status(200).json(orders);
  });
});

router.post("/GetCreditCards", function (req, res) {
  const cid = req.body.cid;
  Customer.getCreditCards(cid, (err, cards) => {
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

router.post("/AddFood", function (req, res) {
  Customer.addFood(
    req.body.oid,
    req.body.fid,
    req.body.quantity,
    req.body.total_price,
    (err, result) => {
      if (err.error) return res.status(404).json(err);
      return res.status(200).json(result);
    }
  );
});

module.exports = router;
