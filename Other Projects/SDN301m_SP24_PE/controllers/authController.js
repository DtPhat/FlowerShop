const Accounts = require('../models/accounts');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/jwt');

// User login

const index = async (req, res) => {
  res.render('login')
};


const loginJWT = async (req, res) => {
  try {
    const { us, pw } = req.body;

    const errors = []

    if (!us || !pw) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const user = await Accounts.findOne({ us });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const pwMatch = await bcrypt.compare(pw, user.pw);
    if (!pwMatch) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: jwtExpiration,
    });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Token failed' });
  }
};

const loginLocal = async (req, res) => {
  try {
    const { us, pw } = req.body;

    const errors = []

    if (!us || !pw) {
      errors.push('Please enter all fields');
    }

    const user = await Accounts.findOne({ us });

    if (!user) {
      errors.push('Invalid username or password' );
    } else {
      const pwMatch = await bcrypt.compare(pw, user.pw);
      if (!pwMatch) {
        errors.push('Invalid username or password');
      }
    }

    if (errors.length > 0) {
      return res.render('login', {
        errors
      });
    }

    req.session.user = user; // Set session identifier
    res.redirect('/')
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    console.log(error)
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/auth');
};

module.exports = {
  loginJWT,
  index,
  loginLocal,
  logout
};