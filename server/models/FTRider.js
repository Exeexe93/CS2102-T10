const db = require("../database/index.js");

class FTRider {
  static getPendingOrders(callback) {
    db.query("SELECT * FROM Orders WHERE rid IS NULL", (err, res) => {
      if (err.error) {
        console.log("Could not obtain pending orders: ", err);
        return callback(err, res);
      }
      return callback(err, res);
    });
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
        return callback(err, newAverageRating);
      }
    );
  }
}

module.exports = FTRider;
