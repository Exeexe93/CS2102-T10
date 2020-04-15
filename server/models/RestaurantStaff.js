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
        "INSERT INTO Foods (menu_id, name, price, food_limit, quantity, category) values (1, $1, $2, $3, $4, $5)",
        [name,
        price,
        food_limit,
        quantity,
        category],
        (err, res) => {
            if (err.error) {
                console.err("Could not add food item: ", err);
                return callback(err);
            }
            return callback(res);
        }
    );
  }

  static deleteFood(fid, callback) {
    db.query('DELETE FROM Foods WHERE fid = $1', [fid], (err, res) => {
    if (err.error) {
      return callback(err);
    }
    return callback(res);
  });
}
}

module.exports = RestaurantStaff;
