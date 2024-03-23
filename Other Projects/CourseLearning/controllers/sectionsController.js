const { isValidObjectId } = require('mongoose');
const Sections = require('../models/sections')
const Courses = require('../models/courses')

const getSections = async (req, res) => {
  try {
    const sections = await Sections.find().populate('course')
    res.render('sections', { sections })
  } catch (error) {
    res.status(500).json({ error });
  }
}


const createSection = async (req, res) => {
  const { sectionName, sectionDescription, duration, isMainTask, course } = req.body
  const errors = []
  if (!sectionName || !sectionDescription || !duration || !course) {
    errors.push('All fields are required.')
  }

  const nameRegex = /^[A-Z][a-zA-Z0-9\/ ]*$/;
  if (!nameRegex.test(sectionName)) {
    errors.push('Invalid format. Each word must begin with a capital letter and include only letters (a-z, A-Z), digits (0-9), "/", and spaces.');
  }

  if (!isValidObjectId(course)) {
    return res.status(404).json("Invalid course")
  }

  try {
    const foundCourse = await Courses.findById(course)
    if (!foundCourse) {
      errors.push('Course not found.');
    }

    const foundSectionName = await Sections.find({ sectionName, course })
    if (foundSectionName.length) {
      errors.push('Sector name already existed in this course.');
    }
    if (errors.length) {
      const courses = await Courses.find()
      return res.render('create', { courses, errors })
    }

    const newSection = new Sections(req.body);
    // await newSection.validate()
    await newSection.save()
    res.redirect('/sections')
    // res.status(200).json({ newSection });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const deleteSection = async (req, res) => {
  const { id } = req.params
  try {
    const section = await Sections.findById(id)
    if (!section) {
      res.status(404);
      throw new Error("Section not found");
    }
    await section.deleteOne({ id })
    res.status(200).json('Deleted')
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateSection = async (req, res) => {
  const { id } = req.params
  const { sectionName, sectionDescription, duration, isMainTask, course } = req.body
  const errors = []


  if (!sectionName || !sectionDescription || !duration || !course) {
    errors.push('All fields are required.')
  }

  const nameRegex = /^[A-Z][a-zA-Z0-9\/ ]*$/;
  if (!nameRegex.test(sectionName)) {
    errors.push('Invalid format. Each word must begin with a capital letter and include only letters (a-z, A-Z), digits (0-9), "/", and spaces.');
  }

  if (!isValidObjectId(course)) {
    return res.status(404).json("Invalid course")
  }

  try {
    const section = await Sections.findById(id)
    if (!section) {
      errors.push('Section not found.');
    }

    const foundCourse = await Courses.findById(course)
    if (!foundCourse) {
      errors.push('Course not found.');
    }

    const foundSectionNameCourse = await Sections.find({ sectionName, course })
    if (foundSectionNameCourse.length && foundSectionNameCourse.id != id) {
      errors.push('Sector name already existed in this course.');
    }

    if (errors.length) {
      const courses = await Courses.find()
      return res.status(400).render('update', { section, courses, errors })
    }

    const updatedSections = await Sections.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedSections)
  } catch (error) {
    res.status(500).json({ error });
  }
}


const renderCreateSection = async (req, res) => {
  const courses = await Courses.find()
  res.render('create', { courses })
}

const renderUpdateSection = async (req, res) => {
  const { id } = req.params
  const courses = await Courses.find()
  const section = await Sections.findById(id)
  res.render('update', { section, courses })
}


module.exports = {
  getSections,
  createSection,
  deleteSection,
  updateSection,
  renderCreateSection,
  renderUpdateSection
};