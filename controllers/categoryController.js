const Category = require('../models/categories')
const isValidObjectId = require('mongoose').Types.ObjectId.isValid;

const getCategories = async (req, res) => {
  const categories = await Category.find()
  return res.render('categories', {
    user: req.user,
    title: 'The orchid shop',
    categories: categories
  })
}

const getCategory = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json("Invalid Id")
    }
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json("Category not found");
      // throw new Error("Category not found");
    }
    return res.render('categoryDetails', {
      user: req.user,
      category: category,
      title: 'The orchid shop',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const createCategory = async (req, res) => {
  const { name, description } = req.body
  if (!name) {
    return res.status(400).json("Name is a required field")
  }
  try {
    const existingName = await Category.findOne({ "name": name })
    if (existingName) {
      return res.status(400).json(existingName.name + " is already exist!")
    }

    const createdCategory = await Category.create({
      name,
      description
    })
    res.status(200).json(createdCategory)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateCategory = async (req, res) => {
  const { name } = req.body
  if (!name) {
    return res.status(400).json("Name is a required field")
  }
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json("Invalid Id")
    }



    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404);
    }

    const existingName = await Category.findOne({ "name": name })
    if (existingName && existingName.id != req.params.id) {
      return res.status(400).json(existingName.name + " is already exist!")
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedCategory)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const deleteCategory = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json("Invalid Id")
    }
    const category = await Category.findById(req.params.id)
    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }
    const deletedCategory = await Category.deleteOne({ _id: req.params.id })
    res.status(200).json(deletedCategory)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
}