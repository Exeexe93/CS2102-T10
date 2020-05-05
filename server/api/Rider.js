const express = require("express");
const Rider = require("../models/Rider");

const router = express.Router();

router.post("/acceptOrder", (request, response) => {
  const oid = request.body.oid;
  const rid = request.body.rid;
  Rider.acceptOrder(oid, rid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/getOngoingOrder", (request, response) => {
  const rid = request.body.rid;
  Rider.getOngoingOrder(rid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/getStatusDepartForRestaurant", (request, response) => {
  const oid = request.body.oid;
  Rider.getStatusDepartForRestaurant(oid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/getStatusArriveAtRestaurant", (request, response) => {
  const oid = request.body.oid;
  Rider.getStatusArriveAtRestaurant(oid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/updateStatusArriveAtRestaurant", (request, response) => {
  const oid = request.body.oid;
  Rider.updateStatusArriveAtRestaurant(oid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/getStatusDepartForDelivery", (request, response) => {
  const oid = request.body.oid;
  Rider.getStatusDepartForDelivery(oid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/getStatusDeliverToCustomer", (request, response) => {
  const oid = request.body.oid;
  Rider.getStatusDeliverToCustomer(oid, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

module.exports = router;
