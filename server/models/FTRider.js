const db = require("../database/index.js");

class FTRider {
  static getPendingOrders(callback) {
    db.query(
      "SELECT O.oid AS order_number, C.name AS cname, DL.address AS delivery_location, R.name AS restaurant_name, R.address AS restaurant_location FROM Orders O INNER JOIN Restaurants R using(rest_id) INNER JOIN Places P using(oid) INNER JOIN Customers C using(cid) INNER JOIN DeliveryLocations DL using(cid) WHERE O.rid IS NULL",
      (err, res) => {
        if (err.error) {
          console.log("Could not obtain pending orders: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static getAverageRating(rid, callback) {
    let newAverageRating;
    db.query(
      "SELECT ROUND(AVG(rating)::numeric,2) AS avg_rating FROM Rates WHERE rid = $1 GROUP BY rid",
      [rid],
      (err, res) => {
        if (err.error) {
          console.log("Could not check average rating of FT Rider: ", err);
          return callback(err, res);
        }
        console.log(res);
        newAverageRating = res[0].avg_rating;
      }
    );

    db.query(
      "UPDATE FTRiders SET avg_rating = $2::Real WHERE rid = $1",
      [rid, newAverageRating],
      (err, res) => {
        if (err.error) {
          console.log("Could not update average rating of FT Rider: ", err);
          return callback(err, res);
        }
        return callback(err, [{ rating: newAverageRating }]);
      }
    );
  }

  static getName(rid, callback) {
    db.query("SELECT name FROM FTRiders WHERE rid = $1", [rid], (err, res) => {
      if (err.error) {
        console.log("Could not obtain name of FT Rider: ", err);
        return callback(err, res);
      }
      return callback(err, res);
    });
  }
}

module.exports = FTRider;
