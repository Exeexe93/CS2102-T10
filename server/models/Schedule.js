const db = require("../database/index.js");

class Schedule {
  // Get MWS for current month
  static getMWS(callback) {
    db.query("", [], (err, res) => {
      if (err.error) {
        console.log("Could not obtain MWS: ", err);
        return callback(err, res);
      }
      return callback(err, res);
    });
  }
}

module.exports = Schedule;
