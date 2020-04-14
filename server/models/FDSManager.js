const db = require("../database");

class FDSManager {
    static queryTotalNewCustomers(month, year, callback) {  
        db.query(
            'SELECT COUNT(*) as num FROM Accounts a1 join Customers c1 on a1.account_id = c1.cid WHERE (SELECT EXTRACT(MONTH FROM date_created)) = $1 and (SELECT EXTRACT(YEAR FROM date_created)) = $2;',
            [month, year], 
            function (err, res) {
                if (err.error)
                    return callback(err);
                console.log("From Models Manager");
                console.log(res[0].num);
                return callback(err, res);
            });
    }

}

module.exports = FDSManager;
