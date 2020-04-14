const db = require("../database/index.js");

class Customer {
  static getRestaurantList(callback) {
    db.query("SELECT name FROM Restaurants", (err, res) => {
      if (err.error) {
        return callback(err);
      }
      return callback(res);
    });
  }
}

module.exports = Customer;
