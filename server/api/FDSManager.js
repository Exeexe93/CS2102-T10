let express = require('express');
let FDSManagerModel = require('../models/FDSManager');

let router = express.Router();

router.post('/', (req, res) => {
    let month = req.body.month;
    let year = req.body.year;
    FDSManagerModel.queryTotalNewCustomers(month, year, (err, result) => {
        if (err.error) {
            console.log("Error occurred at FDSManager api post new customer method");
            return res.json(err);
        }
        return res.json(result);
    });
});

router.post('/monthlyOrders', (req, res) => {
    let month = req.body.month;
    let year = req.body.year;
    FDSManagerModel.queryMonthOrders(month, year, (err, result) => {
        if (err.error) {
            console.log("Error occurred at FDSManager api post monthly orders");
            return res.json(err);
        }
        return res.json(result);
    })
});

router.post('/monthlyOrdersCost', (req, res) => {
    let month = req.body.month;
    let year = req.body.year;
    FDSManagerModel.queryMonthlyOrderCost(month, year, (err, result) => {
        if (err.error) {
            console.log("Error occurred at FDSManager api post monthly orders cost");
            return res.json(err);
        }
        return res.json(result);
    })
})

router.post('/monthlyCustomersStats', (req, res) => {
    let month = req.body.month;
    let year = req.body.year;
    FDSManagerModel.queryCustomersStats(month, year, (err, result) => {
        if (err.error) {
            console.log("Error occurred at FDSManager api post monthly Customer stats");
            return res.json(err);
        }
        console.log("api result");
        console.log(result);
        return res.json(result);
    })
})

module.exports = router;
