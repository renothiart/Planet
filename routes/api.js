var express = require('express')
var router = express.Router();
var Schedule = require('../models/schedule.js')
var User = require('../models/newuser.js')

router.post('/inviteUser', function (req, res, next) {
    
    Schedule.findById(req.body.sid, function (err, schedule) {
        if (schedule == null) {
            console.log("No such schedule");
        } else {
            User.find({username : req.body.invited}, function (err, result) {
                if (result == null) {
                    console.log("no such user");
                } else {
                    schedule.usernames.push(req.body.invited);
                    var userSchedule = []
                    for (let i = 0; i < 24; i++) {
                        if(schedule.availability[i] == -1) {
                            userSchedule.push(-1);
                        } else {
                            userSchedule.push(0);
                        }
                    }
                    var userSchedules = schedule.userSchedules['dic'];
                    userSchedules[req.body.invited] = userSchedule;
                    schedule.markModified('userSchedules.dic');
                    schedule.save(function (saveErr, result) {
                        if (saveErr) next(saveErr);
                        res.json({ status: 'OK' })
                    })
                }
            })
        }
    })
})

router.get('/getSchedules', function (req, res, next) {
    var scheduleDb = Schedule.find({usernames : req.session.user}, function (err, results) {
        if (!err) {
          res.json({'user' : req.session.user, 'results': results});
        } else {
          next(err);
        }
    })
})

router.post('/newSchedule', function (req, res, next) {
    var { scheduleName, earlyBound, lateBound, date, availability } = req.body; // ES6 shorthand
    availability = JSON.parse(availability);
    let u = req.session.user;
    let usdict = {};
    usdict[u] = availability;
    var s = new Schedule({ scheduleName, creator : u, usernames : [u], earlyBound, lateBound, date, userSchedules : { dic : usdict}, availability }) // ES6 shorthand
    s.save(function (err, result) {
      if (err) next(err);
      res.json({ status: 'OK' })
    })
})

router.post('/updateSchedule', function (req, res, next) {
    var { availability, userSchedule } = req.body; // ES6 shorthand
    availability = JSON.parse(availability);
    userSchedule = JSON.parse(userSchedule);
    Schedule.findById(req.body.sid, function (err, schedule) {
        if(schedule == null) {
            console.log('no such schedule');
        } else {
            schedule.availability = availability;
            var userSchedules = schedule.userSchedules['dic'];
            userSchedules[req.session.user] = userSchedule;
            schedule.markModified('userSchedules.dic');
            schedule.save(function (saveErr, result) {
                if (saveErr) next(saveErr);
                res.json({ status: 'OK' })
            })
        }
    })
})


module.exports = router;
