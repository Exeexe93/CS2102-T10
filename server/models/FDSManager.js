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
            'With RiderOrders as (select r.rid, r.name, sum(o.total_price) as total_price, MAX(age(deliver_to_cust, depart_for_rest)) as delivery_duration, count(distinct o.rating) as num_rating, round(avg(rating), 2) as avg_rating, count(o.oid) as num_orders ' +
            'from Riders r left join Orders o using (rid) where extract(month from o.order_placed) = $1 and extract(year from o.order_placed) = $2 group by rid order by name), ' + 
            'RiderSalary as (select r.rid, sum(amount) as salary, start_date from Salaries right join Riders r using (rid) where extract(month from start_date) = $1 and extract(year from start_date) = $2 group by (rid, start_date)), ptwh as ' + 
            '(select rid, max(name) as name, sum(total_hours) as total_hours from (select rid, riders.name, max(total_hours) as total_hours from Riders left join ptriders using (rid) left join ptworks using (rid) ' + 
            'left join wws using(wid) left join contains using(wid) left join shift using(shift_id) where extract(month from actual_date) = $1 and extract(year from actual_date) = $2 group by rid) as helpptwh ' +
            'group by rid), ftwh as (select rid, max(name) as name, max(total_hours) as total_hours from (select rid, riders.name, max(total_hours) as total_hours from Riders left join ftriders using (rid) left join ftworks using (rid) left join mws using(mid) left join has using(mid) ' +
            'left join wws using(wid) left join contains using(wid) left join shift using(shift_id) where extract(month from actual_date) = $1 and extract(year from actual_date) = $2 group by rid) as helpftwh ' +
            'group by rid), RiderWorkHour as (select rid, name, coalesce(ptwh.total_hours, ftwh.total_hours) as total_hours from Riders left join ptwh using (rid,name) left join ftwh using (rid,name)) select rid, r.name, coalesce(ro.total_price, 0::money) as total_price, coalesce(ro.delivery_duration, \'00:00:00\') as delivery_duration, ' +
            'coalesce(ro.num_rating, 0) as num_rating, coalesce(ro.avg_rating, 0) as avg_rating, coalesce(ro.num_orders, 0) as num_orders, coalesce(rs.salary, 0::money) as salary, coalesce(rwh.total_hours, 0) as total_hours from Riders r left join RiderOrders as ro using (rid) left join RiderSalary as rs using (rid) left join RiderWorkHour ' + 
            'as rwh using (rid) order by name',
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

    static queryGetName(accountid, callback) {
        db.query(
            'select * from FDSManagers where fds_id = $1',
            [accountid],
            (err, res) => {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryGetName:", err.error);
                }
                callback(err, res);
            }

        )
    }

    static queryGetAllRiderName(callback) {
        db.query(
            'select * from Riders order by name;',
            (err, res) => {
                if (err.error) {
                    cosole.log("Error occured at FDSManagerModel#queryGetAllRiderName:", err.error);
                }
                callback(err, res);
            }
        )
    }

    static queryAddPromo(promoStart, promoEnd, promo_type, category, details,
        discount_value, trigger_value, creator_id, use_limit, callback) {
        let limitWord = use_limit ? ', use_limit) ' : ') ' 
        let limit = use_limit ? ', $9)' : ')'
        let queryVariablesList = 
            use_limit ? [promoStart, promoEnd, promo_type, category, details, discount_value, trigger_value, creator_id, use_limit]
                : [promoStart, promoEnd, promo_type, category, details, discount_value, trigger_value, creator_id]
        use_limit ? console.log("use_limit: ", use_limit) : ("nothing")
        console.log("promoStart %s\npromoEnd %s", promoStart, promoEnd);
        db.query(
            'INSERT into Promos(start_time, end_time, promo_type, category, details, discount_value, trigger_value, creator_id' + limitWord +
            'VALUES (to_timestamp($1, \'ddmmyyyy HH24:MI:SS\'), to_timestamp($2, \'ddmmyyyy HH24:MI:SS\'), $3, $4, $5, $6, $7, $8' +
            limit, queryVariablesList,
            (err, res) => {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryAddPromo:", err.error);
                }
                callback(err, res);
            }

        )
    }

    static queryGetActivePromo(creator_id, callback) {
        db.query(
            'select use_limit, promo_id, details, category, promo_type, discount_value, trigger_value, to_char(start_time, \'dd-mm-yyyy HH24:MI:SS\') as start_time, to_char(end_time, \'dd-mm-yyyy HH24:MI:SS\') as end_time from Promos where creator_id = $1 and extract(day from (end_time - current_timestamp)) > 0;',
            [creator_id],
            (err, res) => {
                if (err.error) {
                    console.log("Error occurred at FDSManagerModel#queryGetActivePromo:", err.error);
                }
                callback(err, res);
            }

        )
    }
}

module.exports = FDSManager;
