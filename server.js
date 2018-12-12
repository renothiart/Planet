var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieSession = require('cookie-session');
var mongoose = require('mongoose');
var isAuthenticated = require('./middlewares/isAuthenticated.js');
var Schedule = require('./models/schedule.js');
var accountRouter = require('./routes/account.js');
var scheduleRouter = require('./routes/schedule.js');
var apiRouter = require('./routes/api.js');
var app = express();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/planet')

app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieSession({
  name: 'local-session',
  keys: ['spooky'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get('/', function (req, res, next) {
  schedules = Schedule.find({usernames: req.session.user}, function (err, result) {
    if (err) next(err)
    res.render('index', { 
      schedules: result, 
      user: req.session.user 
    })
  })
});



app.use('/account', accountRouter);
app.use('/schedule', scheduleRouter);
app.use('/api', apiRouter);

// don't put any routes below here!
app.use(function (err, req, res, next) {
  return res.send('ERROR :  ' + err.message)
})

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port ' + (process.env.PORT || 3000))
})
