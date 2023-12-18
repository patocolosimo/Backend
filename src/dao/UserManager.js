const passport = require("passport");
const User = require('./models/user');


passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = {
  authenticate: passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/login",
  }),
};
