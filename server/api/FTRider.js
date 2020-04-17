const express = require("express");
const FTRider = require("../models/FTRider");

const router = express.Router();

router.post("/", (request, response) => {
  const rid = request.body.rid;
  FTRider.getAverageRating(rid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.get("/getPendingOrders", (request, response) => {
  FTRider.getPendingOrders((err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/getName", (request, response) => {
  const rid = request.body.rid;
  FTRider.getName(rid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

module.exports = router;
