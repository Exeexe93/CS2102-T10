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
        console.error(err);
        return callback({ error: "Unable to connect to database!" }, null);
      }
      const params = args.length === 2 ? args[0] : [];
      const callback = args.length === 1 ? args[0] : args[1];
      db.query(query, params, (err, res) => {
        done();
        if (err) {
          console.error(err.stack);
          // Check for error return from database
          return callback({ error: err }, null);
        }
        callback({}, res.rows);
      });
    });
  }

  async transaction(queries, values, callback) {
    const db = await this.pool.connect();
    try {
      await db.query("BEGIN");

      // queries = ['INSERT INTO users(name, nickname) VALUES($1, $2) RETURNING id', 'INSERT INTO users(name) VALUES($1) RETURNING id']
      // value = [[[brian, happy man], [kenny, sad man]], [[xuan en], [michelle]]]
      await Promise.all(
        queries.map(async (query, index) => {
          return await Promise.all(
            values[index].map(async (item) => {
              await db.query(query, item);
            })
          );
        })
      );

      await db.query("COMMIT");
      callback({}, "Success Transaction.");
    } catch (err) {
      await db.query("ROLLBACK");
      console.error(err.stack);
      callback({ error: err }, null);
    } finally {
      db.release();
    }
  }

  end() {
    this.pool.end();
  }
}

module.exports = new Database();
