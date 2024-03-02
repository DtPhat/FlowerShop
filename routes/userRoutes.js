const express = require('express')
const router = express.Router()
const { ensureAuthenticated, verifyAdmin } = require('../config/auth')
const {
  index,
  loginIndex,
  regist,
  login,
  signout,
  updateProfile,
  dashboard,
  profileIndex,
  updatePassword
} = require('../controllers/userController')

router.route('/')
  .get(index)
  .post(regist)

router.route('/login')
  .get(loginIndex)
  .post(login)


router.route('/profile')
  .get(ensureAuthenticated, profileIndex)
  .put(ensureAuthenticated, updateProfile)

router.route('/password')
  .put(ensureAuthenticated, updatePassword)

router.route('/logout')
  .post(signout)

router.route('/dashboard')
  .get(ensureAuthenticated, verifyAdmin, dashboard)


module.exports = router;

