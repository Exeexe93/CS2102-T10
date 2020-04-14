var express = require("express");
var Login = require("../../models/Login");

const router = express.Router();

router.post("/", (request, response) => {
  const account_id = request.body.account_id;
  const account_pass = request.body.account_pass;
  Login.checkLogin(account_id, account_pass, (err, result) => {
    if (err) {
      return response.json(err);
    }
    return response.json(result);
  });
});

module.exports = router;