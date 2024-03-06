const bcrypt = require('bcrypt');
const User = require('../models/users');
const passport = require('passport');
// const authenticate = require('../middlewares/authenticate');
async function index(req, res, next) {
  res.render('register');
}

async function getAllUsers(req, res, next) {
  const users = await User.find()
  return res.render('accounts', {
    currentUser: req.user,
    users: users
  })
}

async function regist(req, res, next) {
  const { username, password, name, YOB } = req.body;
  let errors = [];
  if (!username || !password || !YOB || !name) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (YOB < 1900 || YOB > (new Date).getFullYear()) {
    errors.push({ msg: 'Year of birth is invalid' });
  }
  if (errors.length > 0) {
    return res.render('register', {
      errors,
      username,
      password,
      YOB,
      name
    });
  }
  try {
    const user = await User.findOne({ username: username });
    if (user) {
      errors.push({ msg: 'Username already exists' });
      return res.render('register', {
        errors,
        username,
        password,
        YOB,
        name
      });
    }
    const newUser = new User({
      username,
      password,
      name,
      YOB,
    });
    // Hash password
    const hash = await bcrypt.hash(newUser.password, 10);
    newUser.password = hash;
    await newUser.save();
    // passport.authenticate('local')(req, res, () => {
    //   console.log(res)
    //   res.statusCode = 200;
    //   res.setHeader('Content-Type', 'application/json');
    //   res.json({ success: true, status: 'Registration Successful!' });
    //   res.redirect('/users/login');
    //   return;
    // });
    res.redirect('/users/login')
  } catch (error) {
    next(error);
  }
}
async function loginIndex(req, res) {
  res.render('login');
}

async function updateProfile(req, res) {
  try {
    const { id, username, name, YOB } = req.body
    let errors = []
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({ msg: 'User not found' })
    }

    const existingName = await User.findOne({ username })
    if (existingName && existingName.id != id) {
      return errors.push({ mesg: existingName.username + " is already exist!" })
    }

    if (!username || !YOB || !name) {
      errors.push({ msg: 'Please enter all fields' });
    }
    // if (password.length < 6) {
    //   errors.push({ msg: 'Password must be at least 6 characters' });
    // }
    if (YOB < 1900 || YOB > (new Date).getFullYear()) {
      errors.push({ msg: 'Year of birth is invalid' });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors })
      // return res.render('profile', {
      //   errors,
      //   user: req.user
      // });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // user.password = hashedPassword
    user.username = username
    user.name = name
    user.YOB = YOB
    await user.save()


    return res.status(200).json({ msg: "Profile changed" })
  } catch (error) {
    console.log(error)
  }

}

async function updatePassword(req, res) {
  try {
    const { id, password, newPassword } = req.body
    const user = await User.findById(id)
    if (!user) {
      return res.status(400).json({ msg: 'User not found' })
    }
    let errors = []
    if (newPassword.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
    if(password === newPassword) {
      errors.push({msg : 'New password is equal to old password'})
    }
    // bcrypt.compare(password, user.password, async (err, isMatch) => {
    //   if (err) throw err;
    //   if (!isMatch) {
    //     errors.push({ msg: 'Password is not correct' });
    //   }

    // })
    const isMatchPassword = await bcrypt.compare(password, user.password)
    if (!isMatchPassword) {
      errors.push({ msg: 'Password is not correct' });
    }
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword
    await user.save()

    return res.status(200).json({ msg: "Password updated" })
  } catch (error) {
    console.log(error)
  }

}

async function profileIndex(req, res) {
  return res.render('profile', {
    user: req.user
  });
}

async function login(req, res, next) {
  try {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  } catch (error) {
    console.log(error)
  }

}

async function signout(req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
  });
}

async function dashboard(req, res, next) {
  res.render('dashboard', {
    user: req.user
  })
}


module.exports = {
  index,
  regist,
  loginIndex,
  login,
  signout,
  updateProfile,
  dashboard,
  profileIndex,
  updateProfile,
  updatePassword,
  getAllUsers
};