const express = require("express");
const PTRider = require("../models/PTRider");

const router = express.Router();

router.post("/", (request, response) => {
  const rid = request.body.rid;
  PTRider.getAverageRating(rid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.get("/getPendingOrders", (request, response) => {
  PTRider.getPendingOrders((err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/getName", (request, response) => {
  const rid = request.body.rid;
  PTRider.getName(rid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

module.exports = router;
