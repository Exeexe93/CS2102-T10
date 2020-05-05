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
}

module.exports = Rider;
