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

  static updateProfile(rest_id, name, order_threshold, address, callback) {
    db.query("UPDATE Restaurants SET name = $1, order_threshold = $2, address = $3 WHERE rest_id = $4",
      [name, order_threshold, address, rest_id], (err, res) => {
        if (err.error) {
          return callback(err);
        }
        return callback(res);
      });
  }

  static addPromo(creator_id, details, category, promo_type, discount_value, trigger_value, start_time, end_time, callback) {
    db.query("INSERT INTO Promos (creator_id, details, category, promo_type, discount_value, trigger_value, start_time, end_time) values ($1, $2, $3, $4, $5, $6, $7, $8)",
        [creator_id,
          details,
          category,
          promo_type,
          discount_value,
          trigger_value,
          start_time,
          end_time],
          (err, res) => {
            if (err.error) {
                console.err("Could not add promotion: ", err);
                return callback(err);
            }
            return callback(res);
        });
  }

  static getPromo(rest_id, callback) {
    db.query("SELECT to_char(start_time, 'DD-Mon-YYYY') as start_time, to_char(end_time, 'DD-Mon-YYYY') as end_time, details, discount_value, trigger_value FROM Restaurants INNER JOIN RestaurantStaffs as RS USING (rest_id) INNER JOIN Promos as P on (RS.staff_id = P.creator_id) where rest_id = $1",
      [rest_id], (err, res) => {
        if (err.error) {
          console.err("Could not add promotion: ", err);
          return callback(err);
        }
        return callback(res);
      });
    }
}

module.exports = RestaurantStaff;
