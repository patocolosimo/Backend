const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserManager = require("./UserManager");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserManager.getUserByUsername(username);

      if (!user || !UserManager.verifyPassword(user, password)) {
        return done(null, false, {
          message: "Usuario o contraseña incorrectos",
        });
      }

      let role = "usuario";
      if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
        role = "admin";
      }

      return done(null, { id: user.id, username: user.username, role });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserManager.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
