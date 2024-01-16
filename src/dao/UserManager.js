const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const User = require('./models/user');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return done(null, false, { message: 'Usuario o contraseña incorrectos' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use('github', new GitHubStrategy({
  clientID: 'your-github-client-id',
  clientSecret: 'your-github-client-secret',
  callbackURL: 'http://localhost:8081/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email });
      await user.save();
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

module.exports = {
  authenticateLocal: passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
  }),

  authenticateGitHub: passport.authenticate('github'),

  registerUser: async (email, password) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  },
};
