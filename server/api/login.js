const express = require("express");
const Login = require("../models/Login");

const router = express.Router();

router.post("/", (request, response) => {
  const account_id = request.body.account_id;
  const account_pass = request.body.account_pass;
  Login.checkLogin(account_id, account_pass, (err, result) => {
    if (err) {
      console.log("Fail at Login API");
      return response.status(404).json(err);
    }
    return response.status(200).json(result);
  });
});

module.exports = router;