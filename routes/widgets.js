var express = require('express');
var router = express.Router();

/* GET widgets listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a widget');
});

module.exports = router;