const db = require("../database/index.js");

class Login {
  static checkLogin(account_id, account_pass, callback) {
    db.query(
      "SELECT EXISTS(SELECT 1 FROM Accounts WHERE account_id = $1 AND account_pass = $2)",
      [account_id, account_pass],
      (err, res) => {
        if (err.error) {
          console.err("Could not check login credentials: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }
}

module.exports = Login;
