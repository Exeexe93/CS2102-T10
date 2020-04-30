const db = require("../database/index.js");

class Signup {
  static getRestaurants(callback) {
    db.query(
      "SELECT name AS rname, rest_id AS restId FROM Restaurants;",
      (err, res) => {
        if (err.error) {
          console.log("Could not obtain all restaurants: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static checkAvailableAccountId(account_id, callback) {
    db.query(
      "SELECT NOT EXISTS(SELECT 1 FROM Accounts WHERE account_id = $1) AS is_account_id_available",
      [account_id],
      (err, res) => {
        if (err.error) {
          console.log("Could not obtain account id information: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }
}

module.exports = Signup;
