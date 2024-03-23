const Members = require('../models/members');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiration } = require('../config/jwt');

// User login

const index = async (req, res) => {
  res.render('login')
};


const loginJWT = async (req, res) => {
  try {
    const { username, password } = req.body;

    const errors = []

    if (!username || !password) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const user = await Members.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
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
    const { username, password } = req.body;

    const errors = []

    if (!username || !password) {
      errors.push('Please enter all fields');
    }

    const user = await Members.findOne({ username });

    if (!user) {
      errors.push('Invalid username or password' );
    } else {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
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