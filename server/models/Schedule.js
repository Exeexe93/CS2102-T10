const db = require("../database/index.js");

class Schedule {
  // Get MWS for current month
  static getMWS(rid, month, callback) {
    // FTWorks => Has
    db.query("", [], (err, res) => {
      if (err.error) {
        console.log("Could not obtain MWS: ", err);
        return callback(err, res);
      }
      return callback(err, res);
    });
  }

  static submitUpdateFTSchedule(queryList, valueList, callback) {
    db.transaction(queryList, valueList, (err, res) => {
      if (err.error) {
        console.log("Could not update the FT Schedule", err);
        return callback(err, res);
      }
      return callback(err, res);
    });
  }
}

module.exports = Schedule;
