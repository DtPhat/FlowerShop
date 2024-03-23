const { isValidObjectId } = require('mongoose');
const Brands = require('../models/brands')
const Watches = require('../models/watches')

const getBrands = async (req, res) => {
  try {
    const brands = await Brands.find()
    res.status(200).json({ brands });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const createBrand = async (req, res) => {
  const { brandName } = req.body
  if (!brandName ) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  try {
    const newBrand = new Brands({
      brandName: brandName,
    });

    await newBrand.save()
    res.status(200).json({ newBrand });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const getBrand = async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) {
    return res.status(404).json("Invalid Id")
  }
  try {
    const brand = await Brands.findById(id)

    if (!brand) {
      return res.status(400).json({ error: "Brand not found" })
    }

    res.status(200).json({ brand });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const deleteBrand = async (req, res) => {
  const { id } = req.params
  if (!isValidObjectId(id)) {
    return res.status(404).json("Invalid Id")
  }
  try {
    const brand = await Brands.findById(id)

    if (!brand) {
      return res.status(400).json({ error: "Not found" })
    }

    const refering = await Watches.find({ brand: id })
    
    if(refering) {
      return res.status(409).json({ error: "Cannot delete brand as it is referenced" })
    }

    await Brands.findByIdAndDelete(id)

    res.status(200).json({ deletedData: brand });
  } catch (error) {
    res.status(500).json({ error });
  }
}

const updateBrand = async (req, res) => {
  const { brandName} = req.body
  const { id } = req.params
  if (!brandName) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  if (!isValidObjectId(id)) {
    return res.status(404).json("Invalid Id")
  }
  try {

    const brand = await Brands.findById(id)
    if (!brand) {
      res.status(400).json("Not found")
    }

    const updatedData = await Brands.findByIdAndUpdate(
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
  getBrands,
  createBrand,
  getBrand,
  deleteBrand,
  updateBrand
};