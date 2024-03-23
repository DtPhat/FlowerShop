var express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse
} = require('../controllers/coursesController');
var router = express.Router();

/* GET home page. */
router.route('/')
  .get(verifyToken, getCourses)
  .post(verifyToken, createCourse)

router.route('/:id')
  .get(verifyToken, getCourse)
  .put(verifyToken, updateCourse)
  .delete(verifyToken, deleteCourse)


module.exports = router;
