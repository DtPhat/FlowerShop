const mongoose = require('mongoose')
const passportLocalMoogose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  name: String,
  YOB: Number,
  isAdmin: {
    type: Boolean,
    default: false
  }
},
  { timestamps: true }
)

userSchema.plugin(passportLocalMoogose)

const User = mongoose.model('User', userSchema)

module.exports = User