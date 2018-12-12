var mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  scheduleName: { type : String },
  creator: { type : String },
  usernames : { type : [String]},
  earlyBound : { type : Number },
  lateBound : { type : Number },
  date : { type : String },
  userSchedules : { dic : {}},
  availability : { type : [Number]}
})

module.exports = mongoose.model('Schedule', scheduleSchema);
