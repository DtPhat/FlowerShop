const mongoose = require('mongoose')
const orchidSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: String,
  price: Number,
  original: String,
  isNatural: Boolean,
  color: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }
},
  { timestamps: true }
)

const Orchid = mongoose.model('Orchid', orchidSchema)

module.exports = Orchid