var express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getBrands,
  getBrand,
  createBrand,
  deleteBrand,
  updateBrand
} = require('../controllers/brandsController');
var router = express.Router();

/* GET home page. */
router.route('/')
  .get(verifyToken, getBrands)
  .post(verifyToken, createBrand)

router.route('/:id')
  .get(verifyToken, getBrand)
  .put(verifyToken, updateBrand)
  .delete(verifyToken, deleteBrand)


module.exports = router;
