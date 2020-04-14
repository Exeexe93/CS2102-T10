const db = require("../database/index.js");

class RestaurantStaff {
  static getFoodItems(callback) {
      db.query("SELECT * FROM Foods", (err, res) => {
      if (err.error) {
        return callback(err);
      }
      return callback(res);
    });
  }

  static addFood(name, price, food_limit, quantity, category, callback) {
    db.query(
        "INSERT INTO Foods (name, price, food_limit, quantity, category) values ('$1', '$2', '$3', '$4', '$5')",
        name,
        price,
        null,
        null,
        category,
        (err, res) => {
            if (err.error) {
                console.err("Could not add food item: ", err);
                return callback(err);
            }
            return callback(res);
        }
    );
  }
}

module.exports = RestaurantStaff;
