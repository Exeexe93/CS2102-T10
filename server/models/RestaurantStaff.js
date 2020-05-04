const db = require("../database/index.js");

class RestaurantStaff {

  static getRestaurantStaffDetails(staff_id, callback) {
    db.query(
      "SELECT * FROM RestaurantStaffs NATURAL JOIN Restaurants WHERE staff_id = $1", [staff_id], (err, res) => {
        if (err.error) {
          return callback(err);
        }
        return callback(res);
      });
  }

  static getFoodItems(rest_id, callback) {
      db.query("SELECT * FROM Foods WHERE rest_id = $1", [rest_id], (err, res) => {
      if (err.error) {
        console.err("Could not get food items: ", err);
        return callback(err);
      }
      return callback(res);
    });
  }

  static addFood(rest_id, name, price, food_limit, quantity, category, callback) {
    db.query(
        "INSERT INTO Foods (rest_id, name, price, food_limit, quantity, category) values ($1, $2, $3, $4, $5, $6)",
        [rest_id,
        name,
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
        });
  }

  static deleteFood(fid, callback) {
    db.query("DELETE FROM Foods WHERE fid = $1", [fid], (err, res) => {
    if (err.error) {
      return callback(err);
    }
    return callback(res);
  });
  }

  static getNumOfOrders(rest_id, callback) {
    db.query("SELECT COUNT(rest_id) FROM Orders WHERE rest_id = $1 AND order_status = 'paid'", [rest_id], (err, res) => {
      if (err.error) {
        return callback(err);
      }
      return callback(res);
    });
  }

  static getTopItems(rest_id, callback) {
    db.query("SELECT name, SUM(Consists.quantity) as TotalQuantity FROM Foods INNER JOIN Consists USING (fid) WHERE rest_id = $1 GROUP BY fid ORDER BY totalQuantity desc LIMIT 5",
    [rest_id], (err, res) => {
      if (err.error) {
        return callback(err);
      }
      return callback(res);
    });
  }
}

module.exports = RestaurantStaff;
