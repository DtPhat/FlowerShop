const mongoose = require('mongoose')
const memberSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  }
},
  { timestamps: true }
)

const Members = mongoose.model('Members', memberSchema)

module.exports = Members