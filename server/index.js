var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var app = express();

app.options("*", cors());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/users", require("./api/Users"));
app.use("/RestaurantStaff", require("./api/Restaurantstaff.js"));
app.use("/Customer", require("./api/Customer.js"));
app.use("/FDSManager", require("./api/FDSManager.js"));
app.use("/Login", require("./api/Login.js"));
app.use("/Rider", require("./api/Rider.js"));
app.use("/FTRider", require("./api/FTRider.js"));
app.use("/PTRider", require("./api/PTRider.js"));
app.use("/Signup", require("./api/Signup.js"));
app.use("/Schedule", require("./api/Schedule.js"));

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Methods", ["GET", "POST", "OPTIONS"]);
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const db = require("./database/index.js");
// db.query(
//   "UPDATE Restaurants SET name = 'exeexe', order_threshold = 20.20, address = 'asd' WHERE rest_id = 1",
//   (value, output) => {
//     console.log(output);
//   },
// );

// db.query(
//   "SELECT to_char(start_time, 'DD/MM/YYYY') as start_time, to_char(end_time, 'DD/MM/YYYY') as end_time, details, discount_value, trigger_value FROM Restaurants INNER JOIN RestaurantStaffs as RS USING (rest_id) INNER JOIN Promos as P on (RS.staff_id = P.creator_id) where rest_id = 1",
//   (value, output) => {
//     console.log(output);
//   },
// );

module.exports = app;
