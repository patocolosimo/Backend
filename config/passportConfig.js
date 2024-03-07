const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github").Strategy;
const bcrypt = require("bcrypt");
const User = require("./src/dao/models/user");
const logger = require('./logger');

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        logger.debug("Intento de inicio de sesión con email:", email);
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
          logger.error("Error de autenticación local: Usuario o contraseña incorrectos");
          return done(null, false, { message: "Usuario o contraseña incorrectos" });
        }

        let role = user.role || "user";
        if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
          role = "admin";
        }

        logger.debug("Autenticación local exitosa. Rol del usuario:", role);
        return done(null, { ...user.toObject(), role });
      } catch (error) {
        logger.error("Error en la estrategia local:", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: "your-github-client-id",
      clientSecret: "your-github-client-secret",
      callbackURL: "http://localhost:8081/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        if (!user) {
          user = new User({ email });
          await user.save();
        }

        logger.debug("Autenticación GitHub exitosa");
        return done(null, user);
      } catch (error) {
        logger.error("Error en la estrategia GitHub:", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
