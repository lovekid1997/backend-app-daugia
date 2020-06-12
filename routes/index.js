var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('shop/index', {
    title: 'Express',
    concac: 'bulam'
  });
});

module.exports = router; 
