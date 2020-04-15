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

  static getOrders(cid, callback) {
    db.query(
      "select O.oid, R.name as restaurantName, F.name as FoodName, C.quantity, C.total_price, O.total_price as Cost from places join consists as C using (oid) left join foods as F using (fid) left join Orders as O on O.oid = C.oid left join Restaurants as R using (rest_id) where cid = $1",
      [cid],
      (err, res) => {
        if (err.error) {
          console.log(res);
          console.log("Could not get orders data: ", err);
          return callback(err, res);
        }
        console.log(res);
        return callback(err, res);
      }
    );
  }
}

// select O.oid, R.name as restaurantName, F.name as FoodName, C.quantity, C.total_price, O.total_price as Cost from places join consists as C using (oid) left join foods as F using (fid) left join Orders as O on O.oid = C.oid left join Restaurants as R on R.rest_id = O.rest_id where cid = '1b39d987-c6b0-4493-bb95-96e51af734b2';

module.exports = Customer;
