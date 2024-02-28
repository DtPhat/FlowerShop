const bcrypt = require('bcrypt');
const User = require('../models/users');
const passport = require('passport');
const authenticate = require('../authenticate');
async function index(req, res, next) {
  res.render('register');
}

async function regist(req, res, next) {
  const { username, password } = req.body;
  let errors = [];
  if (!username || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (errors.length > 0) {
    return res.render('register', {
      errors,
      username,
      password
    });
  }
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      errors.push({ msg: 'Username already exists' });
      return res.render('register', {
        errors,
        username,
        password
      });
    }
    const newUser = new User({
      username,
      password
    });
    // Hash password
    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;
    await newUser.save();
    passport.authenticate('local')(req, res, user, () => {
      console.log(res)
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({ success: true, status: 'Registration Successful!' });
      res.redirect('/users/login');
      return;
    });

  } catch (error) {
    next(error);
  }

}
async function loginIndex(req, res) {
  res.render('login');
}

async function login(req, res) {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
}

async function signout(req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
}


module.exports = {
  index,
  regist,
  loginIndex,
  login,
  signout
};