const db = require("../database/index.js");

class Login {
  static checkLogin(account_id, account_pass, callback) {
    db.query(
      "SELECT * from accounts where account_id = $1 AND account_pass = $2",
      [account_id, account_pass],
      (err, res) => {
        if (err.error) {
          return callback(err);
        }
        return callback(err, res);
      }
    );
  }
}

module.exports = Login;
