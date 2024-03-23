const mongoose = require('mongoose')
const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
    require: true,
    validate: {
      validator: function (value) {
        const regex = /^[A-Z][a-zA-Z0-9\/ ]*$/;
        return regex.test(value);
      },
      message: 'Invalid format. Each word must begin with a capital letter and include only letters (a-z, A-Z), digits (0-9), "/", and spaces.'
    }
  },
  sectionDescription: {
    type: String,
    require: true
  },
  duration: {
    type: Number,
    require: true
  },
  isMainTask: {
    type: Boolean,
    default: false
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses"
  }
},
  { timestamps: true }
)

const Sections = mongoose.model('Sections', sectionSchema)

module.exports = Sections