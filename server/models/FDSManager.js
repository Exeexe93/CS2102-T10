const db = require("../database");

class FDSManager {
    static queryTotalNewCustomers(month, year, callback) {  
        db.query(
            'SELECT COUNT(*) as num FROM Accounts a1 join Customers c1 on a1.account_id = c1.cid WHERE (SELECT EXTRACT(MONTH FROM date_created)) = $1 and (SELECT EXTRACT(YEAR FROM date_created)) = $2;',
            [month, year], 
            function (err, res) {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryTotalNewCustomers");
                    return callback(err);
                }
                callback(err, res[0]);
            });
    }

    static queryMonthOrders(month, year, callback) {
        db.query(
            'SELECT COUNT(*) as num FROM Orders o1 WHERE (SELECT EXTRACT(MONTH FROM order_placed)) = $1 and (SELECT EXTRACT(YEAR FROM order_placed)) = $2;',
            [month, year],
            (err, res) => {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryMonthOrders");
                }
                callback(err, res[0]);
            }
        );
    }

    static queryMonthlyOrderCost(month, year, callback) {
        db.query(
            'SELECT SUM(total_price) as price FROM Orders o1 WHERE (SELECT EXTRACT(MONTH FROM order_placed)) = $1 and (SELECT EXTRACT(YEAR FROM order_placed)) = $2;',
            [month, year],
            (err, res) => {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryMonthlyOrderCost");
                }
                callback(err, res[0]);
            }
        );
    }

    static queryCustomersStats(month, year, callback) {
        db.query(
            'select count(*) as num, MAX(c1.cid) as cid, MAX(c1.name) as cust_name, SUM(o1.total_price) as total_price from places as p1 join Customers as c1 using(cid) join Orders as o1 using (oid) WHERE (SELECT EXTRACT(MONTH FROM order_placed)) = $1 and (SELECT EXTRACT(YEAR FROM order_placed)) = $2 group by c1.cid',
            [month, year],
            (err, res) => {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryCustomersStats");
                }
                callback(err, res);
            }

        )
    }

    static queryRidersStats(month, year, callback) {
        db.query(
            'select max(delivery_duration) as delivery_duration, max(num_ratings) as num_ratings, max(rating) as avg_rating, count(*) as num_orders, max(salary) as salary, name, rid, SUM(O.total_price) as total_price ' + 
	        'from Riders join Orders as O using (rid) join (select sum(amount) as salary, rid, start_date from Salaries join Riders using (rid) group by rid, start_date) as RidersSalary using (rid) join (select round(avg(rating), 2) as rating, rid, count(*) as num_ratings, ' +
	        '(SELECT age(MAX(deliver_to_cust), MAX(order_placed))) as delivery_duration from Rates join Orders using (rid, oid) group by rid) as RateOrders using (rid) where (SELECT EXTRACT(MONTH FROM RidersSalary.start_date)) = $1 ' + 
            'and (SELECT EXTRACT(YEAR FROM RidersSalary.start_date)) = $2 group by rid;',
            [month, year],
            (err, res) => {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryRidersStats");
                }
                callback(err, res);
            }

        )
    }

    static queryDailyLocationStats(area, day, month, year, callback) {
        area = '% ' + area + '%';
        db.query(
            'select count(*) as num_orders, (SELECT EXTRACT(HOUR FROM o.order_placed)) as hour from Orders o join Places p using (oid) where (SELECT EXTRACT(DAY FROM o.order_placed)) = ($2)::double precision and (SELECT EXTRACT(MONTH from o.order_placed)) = ($3)::double precision and (SELECT EXTRACT(Year from o.order_placed)) = ($4)::double precision and LOWER(p.address) LIKE LOWER($1) group by (SELECT EXTRACT(HOUR FROM o.order_placed))',
            [area, day, month, year],
            (err, res) => {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryDailyLocationStats:", err.error);
                }
                callback(err, res);
            }

        )
    }

}

module.exports = FDSManager;
