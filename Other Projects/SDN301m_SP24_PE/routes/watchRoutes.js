var express = require('express');
const { ensureAuthentication } = require('../middleware/authMiddleware');
const {
  getWatches,
  renderCreateWatch,
  createWatch,
  deleteWatch,
  renderUpdateWatch,
  updateWatch
} = require('../controllers/watchesController');
var router = express.Router();

/* GET home page. */
router.route('/')
  .get(ensureAuthentication, getWatches)
  .post(ensureAuthentication, createWatch)

router.route('/:id')
  .put(ensureAuthentication, updateWatch)
  .delete(ensureAuthentication, deleteWatch)

router.route('/create').get(ensureAuthentication, renderCreateWatch)
router.route('/:id/update').get(ensureAuthentication, renderUpdateWatch)

module.exports = router;
