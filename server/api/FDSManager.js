let express = require('express');
let FDSManagerModel = require('../models/FDSManager');

let router = express.Router();

router.post('/', (req, res) => {
    let month = req.body.month;
    let year = req.body.year;
    console.log("Am i in API month = %s, year = %s", month, year);
    FDSManagerModel.queryTotalNewCustomers(month, year, (err, result) => {
        console.log(err);
        console.log("abcdef")
        console.log(result);
        if (err) {
            console.log(err);
            console.log("From Error of API");
            return res.json(err);
        }
        console.log("From api model");
        console.log(result);
        return res.json(result);
    });
});

module.exports = router;
