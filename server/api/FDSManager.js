let express = require('express');
let FDSManagerModel = require('../models/FDSManager');

let router = express.Router();

router.post('/', function (req, res) {
    let month = req.body.month;
    let year = req.body.year;
    FDSManagerModel.queryTotalNewCustomers(month, year, function (err, fdsmanager) {
        if (err) 
            return res.json(err);
        return res.json(fdsmanager);
    });
});

module.exports = router;
