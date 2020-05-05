const express = require("express");
const Schedule = require("../models/Schedule");
const router = express.Router();

router.get("/getMWS", (request, response) => {
  Schedule.getMWS((err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

module.exports = router;
