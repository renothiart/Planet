var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: { type: String },
  schedules: { type: [String] },
  availability: { type: [Number]}
})

module.exports = mongoose.model('User', userSchema);
