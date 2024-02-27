const Orchid = require('../models/orchids')
const isValidObjectId = require('mongoose').Types.ObjectId.isValid;
const getOrchids = async (req, res) => {
  try {
    const orchids = await Orchid.find().populate('category')
    res.render('orchids', {
      title: 'The list of orchids',
      orchids: orchids
    })
    // res.statusCode = 200
    // return res.json(orchids)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const getOrchid = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json("Invalid Id")
    }
    console.log(req.params.id)
    const orchid = await Orchid.findById(req.params.id)
    if (!orchid) {
      return res.status(404).json("Orchid not found")
    }
    res.render('orchidDetails', {
      title: orchid.name,
      orchid: orchid
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }

}

const createOrchid = async (req, res) => {
  const { name, image, price, original, color } = req.body
  if (!name) {
    return res.status(400).json("Name is a required field")
  }
  if (!image) {
    return res.status(400).json("image is a required field")
  }
  if (!price) {
    return res.status(400).json("price is a required field")
  }
  if (!original) {
    return res.status(400).json("original is a required field")
  }
  if (!color) {
    return res.status(400).json("color is a required field")
  }
  try {
    const existingName = await Orchid.findOne({"name": name})
    if(existingName) {
      return res.status(400).json(existingName.name + " is already exist!")
    }
    // console.log(req.body)
    const createdOrchid = await Orchid.create(req.body)
    res.status(200).json(createdOrchid)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const updateOrchid = async (req, res) => {
  const { name, image, price, original, color } = req.body
  if (!name) {
    return res.status(400).json("Name is a required field")
  }
  if (!image) {
    return res.status(400).json("image is a required field")
  }
  if (!price) {
    return res.status(400).json("price is a required field")
  }
  if (!original) {
    return res.status(400).json("original is a required field")
  }
  if (!color) {
    return res.status(400).json("color is a required field")
  }
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(404).json("Invalid Id")
    }

    

    const orchid = await Orchid.findById(req.params.id)
    if (!orchid) {
      res.status(404);
      throw new Error("Orchid not found");
    }

    const existingName = await Orchid.findOne({"name": name})
    if(existingName && existingName.id != req.params.id) {
      return res.status(400).json(existingName.name + " is already exist!")
    }

    const updatedOrchid = await Orchid.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedOrchid)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }

}

const deleteOrchid = async (req, res) => {
  try {
    const orchid = await Orchid.findById(req.params.id)
    if (!orchid) {
      res.status(404);
      throw new Error("orchid not found");
    }
    await orchid.deleteOne({ _id: req.params.id })
    res.status(200).json('ok')
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}


module.exports = {
  getOrchids,
  getOrchid,
  createOrchid,
  updateOrchid,
  deleteOrchid
}