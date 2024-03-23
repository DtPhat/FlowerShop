const { isValidObjectId } = require('mongoose');
const Courses = require('../models/courses')
const Sectors = require('../models/sections')

const getCourses = async (req, res) => {
  try {
    const courses = await Courses.find()
    res.status(200).json({ courses });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const createCourse = async (req, res) => {
  const { courseName, courseDescription } = req.body
  if (!courseName || !courseDescription) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  try {
    const newCourse = new Courses({
      courseName: courseName,
      courseDescription: courseDescription
    });

    await newCourse.save()
    res.status(200).json({ newCourse });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const getCourse = async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) {
    return res.status(404).json("Invalid Id")
  }
  try {
    const course = await Courses.findById(id)

    if (!course) {
      return res.status(400).json({ error: "Course not found" })
    }

    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const deleteCourse = async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) {
    return res.status(404).json("Invalid Id")
  }
  try {
    const course = await Courses.findById(id)

    if (!course) {
      return res.status(400).json({ error: "Not found" })
    }

    const refering = await Sectors.find({ course: id })
    
    if(refering) {
      return res.status(409).json({ error: "Cannot delete course as it is referenced" })
    }

    await Courses.findByIdAndDelete(id)

    res.status(200).json({ deletedData: course });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const updateCourse = async (req, res) => {
  const { courseName, courseDescription } = req.body
  const { id } = req.params
  if (!courseName || !courseDescription) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  if (!isValidObjectId(id)) {
    return res.status(404).json("Invalid Id")
  }
  try {

    const course = await Courses.findById(id)
    if (!course) {
      res.status(400).json("Not found")
    }

    const updatedData = await Courses.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )

    res.status(200).json({ updatedData });
  } catch (error) {
    res.status(500).json({ error });
  }
}

module.exports = {
  getCourses,
  createCourse,
  getCourse,
  deleteCourse,
  updateCourse
};