let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
let cors = require('cors');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3001;

let pool = new pg.Pool({
    user: 'postgres',
    database: 'delivery',
    password: '',
    host: 'localhost',
    port : 5432,
    max: 10
})

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.post('/api/new-country', function(request, response) {
    var country_name = request.body.country_name;
    var continent_name = request.body.continent_name;
    var eid = request.body.eid;
    var values = [ country_name, continent_name, eid ];
    pool.connect((err, db, done) => {
    if (err) {
        return response.status(400).send(err);
    } else {
        db.query('INSERT INTO countries (country_name, continent_name, eid) VALUES($1, $2, $3)', [...values], (err, table) => {
            done();
            if (err) {
                return response.status(400).send(err);
            } else {
                console.log('DATA INSERTED');
                db.end();
            }
        })
      }
    })
  });

app.listen(PORT, () => console.log('Listening on port ' + PORT));