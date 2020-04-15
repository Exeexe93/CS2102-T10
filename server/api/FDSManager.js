let express = require('express');
let FDSManagerModel = require('../models/FDSManager');

let router = express.Router();

router.post('/', (req, res) => {
    let month = req.body.month;
    let year = req.body.year;
    FDSManagerModel.queryTotalNewCustomers(month, year, (err, result) => {
        if (err.error) {
            console.log("Error occurred at FDSManager api post method");
            return res.json(err);
        }
        return res.json(result);
    });
});

module.exports = router;
