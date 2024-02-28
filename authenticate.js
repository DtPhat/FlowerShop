const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');
const bcrypt = require('bcrypt')

// exports.localPassport = passport.use(
//   new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
//     //Match user
//     User.findOne({ username: username })
//       .then(user => {
//         if (!user) {
//           return done(null, false, { message: 'This username is not registed' });
//         }
//         //Match password
//         bcrypt.compare(password, user.password, (err, isMatch) => {
//           if (err) throw err;
//           if (isMatch) {
//             return done(null, user);
//           }
//           else {
//             return done(null, false, { message: 'Password is incorrect' });
//           }
//         })
//       })
//       .catch(err => console.log(err));
//   })
// )

exports.localPassport = passport.use(
  new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
    //Match user
    try {
      const user = User.findOne({ username: username })
      if (!user) {
        return done(null, false, { message: 'This username is not registed' });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        }
        else {
          return done(null, false, { message: 'Password is incorrect' });
        }
      })
    } catch (error) {
      console.log(error)
    }
  })
)


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    done(error, user);
  });
});

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const dotenv = require('dotenv')
dotenv.config()


exports.getToken = function (user) {
  return jwt.sign(user, process.env.secretKey,
    { expiresIn: 360000 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.secretKey

// exports.jwtPassport = passport.use(new JwtStrategy(opts,
//   (jwt_payload, done) => {
//     console.log("JWT payload: ", jwt_payload);
//     User.findOne({ _id: jwt_payload._id }, (err, user) => {
//       console.log(user)
//       if (err) {
//         return done(err, false);
//       }
//       else if (user) {
//         return done(null, user);
//       }
//       else {
//         return done(null, false);
//       }
//     });
//   }));


exports.jwtPassport = passport.use(new JwtStrategy(opts,
  async (jwt_payload, done) => {
    console.log("JWT payload: ", jwt_payload);
    try {
      const user = await User.findOne({ _id: jwt_payload._id })
      console.log(user)
      if (user) {
        return done(null, user);
      }
      else {
        return done(null, false);
      }
    } catch (error) {
      console.log(error)
    }

  }));

exports.verifyUser = passport.authenticate('jwt', { session: false });