let pg = require("pg");

class Database {
  constructor() {
    this.pool = new pg.Pool({
      user: "postgres",
      database: "delivery",
      password: "",
      host: "localhost",
      port: 5432,
      max: 10
    });

    this.pool.on("error", (err, client) => {
      console.error("Unexpected error on DB.", err);
    });
  }

  query(query, ...args) {
    this.pool.connect((err, db, done) => {
      if (err) {
        throw err;
      }
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];
      db.connect(query, params, (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
          return callback({ error: "Database error..." }, null);
        }
        callback({}, res.rows);
      });
    });
  }

  end() {
    this.pool.end();
  }
}

module.exports = new Database();
