const db = require("../database/index.js");

class Customer {
  static getRestaurantList(callback) {
    db.query("SELECT name FROM Restaurants", (err, res) => {
      if (err.error) {
        return callback(err, res);
      }
      return callback(err, res);
    });
  }

  static getProfile(name, callback) {
    db.query(
      "SELECT reward_points From Customers WHERE name = $1",
      [name],
      (err, res) => {
        if (err.error) {
          console.log("Could not get profile info: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }
}

module.exports = Customer;
