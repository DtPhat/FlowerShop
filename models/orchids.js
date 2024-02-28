const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5, require: true },
  comment: { type: String, require: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true }
}, { timestamps: true })

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
  },
  comments: [commentSchema]
},
  { timestamps: true }
)
const Orchid = mongoose.model('Orchid', orchidSchema)



module.exports = Orchid