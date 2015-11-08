// controllers/index.js

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index');
});

router.get('/welcome', function (req, res) {
    res.render('welcome');
});

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


module.exports = router;