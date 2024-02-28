const express = require('express')
const router = express.Router()
const passport = require('passport')
const {
  index,
  loginIndex,
  regist,
  login,
  signout
} = require('../controllers/userController')

router.route('/')
  .get(index)
  .post(regist)

router.route('/login')
  .get(loginIndex)
  .post(passport.authenticate('local'), login)


router.route('/logout')
  .post(signout)
module.exports = router;

