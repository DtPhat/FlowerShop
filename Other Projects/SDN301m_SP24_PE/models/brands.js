const mongoose = require('mongoose')
const brandSchema = new mongoose.Schema({
  brandName: {
    type: String,
    require: true
  },
},
  { timestamps: true }
)

const Brands = mongoose.model('Brands', brandSchema)

module.exports = Brands