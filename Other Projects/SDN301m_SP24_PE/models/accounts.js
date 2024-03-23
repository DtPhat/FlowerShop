const mongoose = require('mongoose')
const accountSchema = new mongoose.Schema({
  us: {
    type: String,
    require: true
  },
  pw: {
    type: String,
    require: true
  }
},
  { timestamps: true }
)

const Accounts = mongoose.model('Accounts', accountSchema)

module.exports = Accounts