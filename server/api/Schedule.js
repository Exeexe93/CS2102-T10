const express = require("express");
const Schedule = require("../models/Schedule");
const router = express.Router();

router.get("/getMWS", (request, response) => {
  const rid = request.body.rid;
  const month = request.body.month;
  Schedule.getMWS(rid, month, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.get("/submitUpdateFTSchedule", (request, response) => {
  Schedule.submitUpdateFTSchedule(rid, month, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

module.exports = router;
