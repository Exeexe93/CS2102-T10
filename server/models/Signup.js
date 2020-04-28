const db = require("../database/index.js");

class Signup {
  static getRestaurants(callback) {
    db.query(
      "SELECT name AS rname, rest_id AS restId FROM Restaurants;",
      (err, res) => {
        if (err.error) {
          console.log("Could not obtain all restaurants");
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }
}

module.exports = Signup;
