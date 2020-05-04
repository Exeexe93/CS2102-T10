const db = require("../database/index.js");

class Signup {
  static getRestaurants(callback) {
    db.query(
      "SELECT name AS rname, rest_id AS rest_id FROM Restaurants;",
      (err, res) => {
        if (err.error) {
          console.log("Could not obtain all restaurants: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static checkAvailableAccountId(account_id, callback) {
    db.query(
      "SELECT NOT EXISTS(SELECT 1 FROM Accounts WHERE account_id = $1) AS is_account_id_available",
      [account_id],
      (err, res) => {
        if (err.error) {
          console.log("Could not obtain account id information: ", err);
          return callback(err, res);
        }
        return callback(err, res);
      }
    );
  }

  static createAccount(
    account_id,
    name,
    account_password,
    account_type,
    selected_restaurant_id,
    callback
  ) {
    db.query(
      "INSERT INTO Accounts (account_id, account_pass, date_created, account_type) VALUES ($1, $2, TO_DATE(TO_CHAR(current_date, 'mm/dd/yyyy'), 'mm/dd/yyyy'), $3)",
      [account_id, account_password, account_type],
      (err, res) => {
        if (err.error) {
          console.log("Could not create account: ", err);
          return callback(err, res);
        }
      }
    );

    if (account_type === "FDSManager") {
      db.query(
        "INSERT INTO FDSManagers (fds_id, name) VALUES ($1, $2)",
        [account_id, name],
        (err, res) => {
          if (err.error) {
            console.log("Could not create new FDSManager Account: ", err);
            return callback(err, res);
          }
          return callback(err, res);
        }
      );
    }

    if (account_type === "FTRider") {
      db.query(
        "INSERT INTO Riders (rid, name) VALUES ($1, $2)",
        [account_id, name],
        (err, res) => {
          if (err.error) {
            console.log("Could not create new Full Time Rider Account: ", err);
            return callback(err, res);
          }
        }
      );

      db.query(
        "INSERT INTO FTRiders (rid, name) VALUES ($1, $2)",
        [account_id, name],
        (err, res) => {
          if (err.error) {
            console.log("Could not create new Full Time Rider Account: ", err);
            return callback(err, res);
          }
          return callback(err, res);
        }
      );
    }

    if (account_type === "PTRider") {
      db.query(
        "INSERT INTO Riders (rid, name) VALUES ($1, $2)",
        [account_id, name],
        (err, res) => {
          if (err.error) {
            console.log("Could not create new Part Time Rider Account: ", err);
            return callback(err, res);
          }
        }
      );

      db.query(
        "INSERT INTO PTRiders (rid, name) VALUES ($1, $2)",
        [account_id, name],
        (err, res) => {
          if (err.error) {
            console.log("Could not create new Part Time Rider Account: ", err);
            return callback(err, res);
          }
          return callback(err, res);
        }
      );
    }

    if (account_type === "Customer") {
      db.query(
        "INSERT INTO Customers (cid, name, reward_points) VALUES ($1, $2, 0)",
        [account_id, name],
        (err, res) => {
          if (err.error) {
            console.log("Could not create new Customer Account: ", err);
            return callback(err, res);
          }
          return callback(err, res);
        }
      );
    }

    if (account_type === "RestaurantStaff") {
      db.query(
        "INSERT INTO RestaurantStaffs (staff_id, rest_id) VALUES ($1, $2)",
        [account_id, selected_restaurant_id],
        (err, res) => {
          if (err.error) {
            console.log("Could not create new Restaurant Staff Account: ", err);
            return callback(err, res);
          }
          return callback(err, res);
        }
      );
    }
  }
}

module.exports = Signup;
