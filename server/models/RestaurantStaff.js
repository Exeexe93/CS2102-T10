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
      db.query("SELECT * FROM Foods WHERE rest_id = $1 ORDER BY name", [rest_id], (err, res) => {
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

  static updateFood(fid, name, price, food_limit, quantity, category, callback) {
    db.query("UPDATE Foods SET name = $1, price = $2, food_limit = $3, quantity = $4, category = $5 WHERE fid = $6", 
      [name, price, food_limit, quantity, category, fid], (err, res) => {
        if (err.error) {
          return callback(err);
        }
        return callback(res);
      });
    }

  static getOrders(rest_id, callback) {
    db.query("SELECT to_char(deliver_to_cust, 'Mon-YYYY') as order_date, total_price FROM Orders WHERE rest_id = $1 AND order_status = 'paid'", [rest_id], (err, res) => {
      if (err.error) {
        return callback(err);
      }
      return callback(res);
    });
  }

  static getTopItems(rest_id, callback) {
    db.query("SELECT to_char(deliver_to_cust, 'Mon-YYYY') as order_date, name, Consists.quantity as TotalQuantity FROM Foods INNER JOIN Consists USING (fid) INNER JOIN Orders USING (oid) WHERE Foods.rest_id = $1 ORDER BY totalQuantity desc",
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
    db.query("SELECT to_char(start_time, 'DD-Mon-YYYY') as start_time, to_char(end_time, 'DD-Mon-YYYY') as end_time, details, discount_value, trigger_value, promo_type, promo_id FROM Restaurants INNER JOIN RestaurantStaffs as RS USING (rest_id) INNER JOIN Promos as P on (RS.staff_id = P.creator_id) where rest_id = $1 ORDER BY start_time",
      [rest_id], (err, res) => {
        if (err.error) {
          console.err("Could not add promotion: ", err);
          return callback(err);
        }
        return callback(res);
      });
    }

  static getPromoStats(rest_id, callback) {
    db.query("SELECT num_of_times_used, EXTRACT(DAY from end_time - start_time) as duration, to_char(start_time, 'DD-Mon-YYYY') as start_time, to_char(end_time, 'DD-Mon-YYYY') as end_time, details, discount_value, trigger_value, promo_type, promo_id FROM Restaurants INNER JOIN RestaurantStaffs as RS USING (rest_id) INNER JOIN Promos as P on (RS.staff_id = P.creator_id) INNER JOIN (SELECT promo_id, COUNT(promo_id) as num_of_times_used FROM Restaurants INNER JOIN RestaurantStaffs as RS USING (rest_id) INNER JOIN Promos as P on (RS.staff_id = P.creator_id) INNER JOIN Uses USING (promo_id) WHERE end_time < NOW() and rest_id = $1 GROUP BY promo_id) promo_used USING (promo_id) WHERE end_time < NOW() and rest_id = $1 ORDER BY start_time",
    [rest_id], (err, res) => {
        if (err.error) {
          console.err("Could not get promo stats: ", err);
          return callback(err);
        }
        return callback(res);
      });
    }
}

module.exports = RestaurantStaff;
