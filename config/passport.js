const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/users');
module.exports = function (passport) {
	passport.use(
		new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
			//Match user
			User.findOne({ username: username })
				.then(user => {
					if (!user) {
						return done(null, false, { message: 'This username is not registed' });
					}
					//Match password
					bcrypt.compare(password, user.password, (err, isMatch) => {
						if (err) throw err;
						if (isMatch) {
							return done(null, user);
						}
						else {
							return done(null, false, { message: 'Password is incorrect' });
						}
					})
				})
				.catch(err => console.log(err));

		})
	)
	passport.serializeUser((user, done) => {
		return done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findById(id)
			done(null, user);
		} catch (error) {
			done(error, null)
		}
	});
}