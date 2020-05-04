const express = require("express");
const Login = require("../models/Login.js");

const router = express.Router();

router.post("/", (request, response) => {
  const account_id = request.body.account_id;
  const account_pass = request.body.account_pass;
  Login.checkLogin(account_id, account_pass, (err, result) => {
    if (err.error) {
      console.log("Fail at Login API");
      return response.status(404).json(err);
    }
    return response.json(result);
  }
  );
});

module.exports = router;