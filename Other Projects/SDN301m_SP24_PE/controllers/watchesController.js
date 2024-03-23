const { isValidObjectId } = require('mongoose');
const Watches = require('../models/watches')
const Brands = require('../models/brands')

const getWatches = async (req, res) => {
  try {
    const watches = await Watches.find().populate('brand')
    res.render('watches', { watches })
  } catch (error) {
    res.status(500).json({ error });
  }
}


const createWatch = async (req, res) => {
  const { watchName, watchDescription, price, automatic, brand, image } = req.body
  const errors = []
  if (!watchName || !watchDescription || !price || !brand || !image) {
    errors.push('All fields are required.')
  }

  const nameRegex = /^[A-Z][a-zA-Z0-9\/ ]*$/;
  if (!nameRegex.test(watchName)) {
    errors.push('Invalid format. Each word must begin with a capital letter and include only letters (a-z, A-Z), digits (0-9), "/", and spaces.');
  }

  if (!isValidObjectId(brand)) {
    return res.status(404).json("Invalid brand")
  }

  try {
    const foundBrand = await Brands.findById(brand)
    if (!foundBrand) {
      errors.push('Brand not found.');
    }

    const foundWatchName = await Watches.find({ watchName, brand })
    if (foundWatchName.length) {
      errors.push('Watch name already existed in this brand.');
    }
    if (errors.length) {
      const brands = await Brands.find()
      return res.render('create', { brands, errors })
    }

    const newWatch = new Watches(req.body);
    // await newWatch.validate()
    await newWatch.save()
    res.redirect('/watches')
    // res.status(200).json({ newWatch });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const deleteWatch = async (req, res) => {
  const { id } = req.params
  try {
    const watch = await Watches.findById(id)
    if (!watch) {
      res.status(404);
      throw new Error("Watch not found");
    }
    await watch.deleteOne({ id })
    res.status(200).json('Deleted')
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateWatch = async (req, res) => {
  const { id } = req.params
  const { watchName, watchDescription, price, automatic, brand, image } = req.body
  const errors = []


  if (!watchName || !watchDescription || !price || !brand || !image) {
    errors.push('All fields are required.')
  }

  const nameRegex = /^[A-Z][a-zA-Z0-9\/ ]*$/;
  if (!nameRegex.test(watchName)) {
    errors.push('Invalid format. Each word must begin with a capital letter and include only letters (a-z, A-Z), digits (0-9), "/", and spaces.');
  }

  if (!isValidObjectId(brand)) {
    return res.status(404).json("Invalid brand")
  }

  try {
    const watch = await Watches.findById(id)
    if (!watch) {
      errors.push('Watch not found.');
    }

    const foundBrand = await Brands.findById(brand)
    if (!foundBrand) {
      errors.push('Brand not found.');
    }

    const foundWatchNameBrand = await Watches.find({ watchName, brand })
    if (foundWatchNameBrand.length && foundWatchNameBrand.id != id) {
      errors.push('Sector name already existed in this brand.');
    }

    if (errors.length) {
      const brands = await Brands.find()
      return res.status(400).render('update', { watch, brands, errors })
    }

    const updatedWatches = await Watches.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedWatches)
  } catch (error) {
    res.status(500).json({ error });
  }
}


const renderCreateWatch = async (req, res) => {
  const brands = await Brands.find()
  res.render('create', { brands })
}

const renderUpdateWatch = async (req, res) => {
  const { id } = req.params
  const brands = await Brands.find()
  const watch = await Watches.findById(id)
  res.render('update', { watch, brands })
}


module.exports = {
  getWatches,
  createWatch,
  deleteWatch,
  updateWatch,
  renderCreateWatch,
  renderUpdateWatch
};