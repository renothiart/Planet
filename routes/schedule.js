var express = require('express')
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../models/newuser.js')

router.get('/new', function (req, res) {
  res.render('new', {
    user: req.session.user
  });
})

router.post('/new', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var u = new User({ username: username, password: password/*, schedules:[], availability: []*/})
  u.save(function (err, result) { 
    if (err) {
      next(err)
    }
    if (!err) {
      res.redirect('/schedule/new')
    }
  })
})

module.exports = router;
