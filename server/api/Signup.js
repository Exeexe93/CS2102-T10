const express = require("express");
const Signup = require("../models/Signup");

const router = express.Router();

router.get("/getRestaurants", (request, response) => {
  Signup.getRestaurants((err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/checkAvailableAccountId", (request, response) => {
  const account_id = request.body.account_id;
  Signup.checkAvailableAccountId(account_id, (err, result) => {
    if (err.error) {
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

router.post("/createAccount", (request, response) => {
  const account_id = request.body.account_id;
  const name = request.body.name;
  const account_password = request.body.account_password;
  const account_type = request.body.account_type;
  const selected_restaurant_id = request.body.selected_restaurant_id;
  Signup.createAccount(
    account_id,
    name,
    account_password,
    account_type,
    selected_restaurant_id,
    (err, result) => {
      if (err.error) {
        return response.status(404).json(err);
      }
      return response.status(200).json(result);
    }
  );
});

module.exports = router;
