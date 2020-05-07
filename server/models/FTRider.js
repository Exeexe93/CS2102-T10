const db = require("../database/index.js");

class FTRider {
  static getPendingOrders(callback) {
    db.query(
      "SELECT O.oid AS order_number, C.name AS cname, P.address AS delivery_location, R.name AS restaurant_name, R.address AS restaurant_location FROM Orders O INNER JOIN Restaurants R using(rest_id) INNER JOIN Places P using(oid) INNER JOIN Customers C using(cid) WHERE O.rid IS NULL",
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
      "SELECT ROUND(AVG(rating)::numeric,2) AS avg_rating FROM Orders WHERE rid = $1 GROUP BY rid",
      [rid],
      (err, res) => {
        if (err.error) {
          console.log("Could not check average rating of FT Rider: ", err);
          return callback(err, res);
        }
        // Unable to obtain average value (e.g. no orders completed)
        if (res.length === 0) {
          console.log("Unable to calculate average rating of FT Rider");
          return callback(err, [{ avg_rating: null }]);
        } else {
          newAverageRating = res[0].avg_rating;
        }
      }
    );

    // If first query was successful
    if (newAverageRating !== undefined) {
      db.query(
        "UPDATE FTRiders SET avg_rating = $2::Real WHERE rid = $1",
        [rid, newAverageRating],
        (err, res) => {
          if (err.error) {
            console.log("Could not update average rating of FT Rider: ", err);
            return callback(err, res);
          }
          return callback(err, [{ avg_rating: newAverageRating }]);
        }
      );
    }
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

  static getCompletedOrders(rid, callback) {
    db.query(
      "SELECT O.oid AS order_number, C.name AS cname, P.address AS delivery_location, R.name AS restaurant_name, R.address AS restaurant_location FROM Orders O INNER JOIN FTRiders FTR using (rid) INNER JOIN Places P using (oid) INNER JOIN Customers C using (cid) INNER JOIN Restaurants R using (rest_id) WHERE O.rid = $1 AND O.deliver_to_cust IS NOT NULL",
      [rid],
      (err, res) => {
        if (err.error) {
          console.log("Could not obtain completed orders of FT Rider: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static getSalaries(rid, callback) {
    db.query(
      "SELECT sid, to_char(start_date, 'DD-Mon-YYYY') as start_date, to_char(end_date, 'DD-Mon-YYYY') as end_date, amount FROM Salaries WHERE rid = $1 ORDER BY start_date",
      [rid],
      (err, res) => {
        if (err.error) {
          console.log("Could not obtain salary of Rider: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }
}

module.exports = FTRider;
