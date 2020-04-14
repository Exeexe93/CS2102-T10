let express = require('express');
let FDSManagerModel = require('../models/FDSManager');

let router = express.Router();

router.post('/', (req, res) => {
    let month = req.body.month;
    let year = req.body.year;
    FDSManagerModel.queryTotalNewCustomers(month, year, function (err, result) {
        if (err) 
            return res.json(err);
        console.log("From api model");
        console.log(result);
        return res.json(result);
    });
});

module.exports = router;
