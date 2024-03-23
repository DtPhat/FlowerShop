var express = require('express');
const {
  login,
  index,
  loginJWT,
  loginLocal,
  logout
} = require('../controllers/authController');
var router = express.Router();

// Local authnetication
router.route('/')
  .get(index)
  .post(loginLocal)

router.route('/logout')
  .post(logout)

// JWT authentication
router.route('/login')
  .post(loginJWT)


module.exports = router;
