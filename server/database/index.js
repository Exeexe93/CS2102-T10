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

transaction(queries, values, callback) {
    (async () => {
      const db = await this.pool.connect()
      try {
        await db.query('BEGIN')

        // queries = [{'INSERT INTO users(name) VALUES($1, $2) RETURNING id'}, {'INSERT INTO users(name) VALUES($1) RETURNING id'}]
        // value = [[[brian, xian], [kenny,sdafsd]], [[xuan en], [bobo]]]
        queries.map((query, index) => {
          values[index].map(
            (item) => {
              await db.query(query, item);
            }
          )
        })

        await db.query('COMMIT')
      } catch (e) {
        await db.query('ROLLBACK')
        throw e
      } finally {
        callback({}, "Success Transaction.");
        db.release()
      }
    })().catch(e => {
      console.error(e.stack)
      return callback({ error: "Database error... Transaction failed." }, null);
    })
  }

  end() {
    this.pool.end();
  }
}

module.exports = new Database();
