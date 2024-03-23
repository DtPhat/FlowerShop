var express = require('express');
const { ensureAuthentication } = require('../middleware/authMiddleware');
const {
  getSections, renderCreateSection, createSection, deleteSection, renderUpdateSection, updateSection
} = require('../controllers/sectionsController');
var router = express.Router();

/* GET home page. */
router.route('/')
  .get(ensureAuthentication, getSections)
  .post(ensureAuthentication, createSection)

router.route('/:id')
  .put(ensureAuthentication, updateSection)
  .delete(ensureAuthentication, deleteSection)

router.route('/create').get(ensureAuthentication, renderCreateSection)
router.route('/:id/update').get(ensureAuthentication, renderUpdateSection)

module.exports = router;
