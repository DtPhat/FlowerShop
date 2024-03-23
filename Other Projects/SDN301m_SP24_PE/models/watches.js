const mongoose = require('mongoose')
const watchSchema = new mongoose.Schema({
  watchName: {
    type: String,
    require: true
  },
  watchDescription: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  image: {
    type: String,
    require: true
  },
  automatic: {
    type: Boolean,
    default: false
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brands",
    // required: true
  }
},
  { timestamps: true }
)


const Watches = mongoose.model('Watches', watchSchema)

module.exports = Watches