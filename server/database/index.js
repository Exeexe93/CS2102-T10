let pg = require("pg");

class Database {
  constructor() {
    this.pool = new pg.Pool({
      user: "postgres",
      database: "cs2102",
      password: "",
      host: "localhost",
      port: 5432,
      max: 10,
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
      db.query(query, params, (err, res) => {
        done();
        if (err) {
          console.log(err.stack);
          return callback({ error: "Database error..." }, null);
        }
        callback({}, res.rows);
      });
    });
  }

  async transaction(queries, values, callback) {
    const db = await this.pool.connect();
    try {
      await db.query("BEGIN");

      // queries = [{'INSERT INTO users(name, nickname) VALUES($1, $2) RETURNING id'}, {'INSERT INTO users(name) VALUES($1) RETURNING id'}]
      // value = [[[brian, happy man], [kenny, sad man]], [[xuan en], [michelle]]]
      queries.map(async (query, index) => {
        values[index].map(async (item) => {
          await db.query(query, item);
        });
      });

      await db.query("COMMIT");
    } catch (e) {
      await db.query("ROLLBACK");
      console.error(e.stack);
      return callback({ error: "Database error... Transaction failed." }, null);
    } finally {
      callback({}, "Success Transaction.");
      db.release();
    }
  }

  end() {
    this.pool.end();
  }
}

module.exports = new Database();
