var express = require('express');
var router = express.Router();
const {
  index,
  getOrchidIndex,
  postComment,
} = require('../controllers/orchidController');

const {
  dashboard,
  getAllUsers,
} = require('../controllers/userController');

const { ensureAuthenticated, verifyAdmin } = require('../config/auth');

router.route('/').get(index);
router.route('/orchid/:id').get(getOrchidIndex);
router.route('/dashboard').get(ensureAuthenticated, verifyAdmin, dashboard)
router.route('/accounts').get(ensureAuthenticated, verifyAdmin, getAllUsers)
router.route('/orchid/:id/comment').post(ensureAuthenticated, postComment)

module.exports = router;
