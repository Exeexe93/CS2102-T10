const db = require("../database/index.js");

class Rider {
  static acceptOrder(oid, rid, callback) {
    db.query(
      "UPDATE Orders SET rid = $2, order_placed = to_timestamp(to_char(NOW(), 'YYYY-MM-DD HH24:MI:SS'), 'YYYY-MM-DD HH24:MI:SS') WHERE oid = $1",
      [oid, rid],
      (err, res) => {
        if (err.error) {
          console.log("Could not accept order: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  //   order_number,
  //       cname,
  //       delivery_location,
  //       restaurant_name,
  //       restaurant_location,
  static getOngoingOrder(rid, callback) {
    db.query(
      "SELECT O.oid AS order_number, C.name AS cname, P.address AS delivery_location, R.name AS restaurant_name, R.address AS restaurant_location FROM Orders O INNER JOIN Places P using (oid) INNER JOIN Customers C using (cid) INNER JOIN Restaurants R using (rest_id) WHERE O.rid = $1",
      [rid],
      (err, res) => {
        if (err.error) {
          console.log("Could not accept order: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }
}

module.exports = Rider;
