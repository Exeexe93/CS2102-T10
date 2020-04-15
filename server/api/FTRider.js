const express = require("express");
const FTRider = require("../models/FTRider");

const router = express.Router();

router.get("/", (request, response) => {
  const rid = request.body.rid;
  FTRider.getAverageRating(rid, (err, result) => {
    if (err) {
      return response.json(err);
    }
    return response.json(result);
  });
});

router.get("/getPendingOrders", (request, response) => {
  FTRider.getPendingOrders((err, result) => {
    if (err) {
      return response.json(err);
    }
    return response.json(result);
  });
});

module.exports = FTRider;
