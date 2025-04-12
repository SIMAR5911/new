const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      const user = await User.findOne({ username });
      if (!user) return done(null, false);
      const match = await bcrypt.compare(password, user.password);
      return match ? done(null, user) : done(null, false);
    }
  ));

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ githubId: profile.id });
      if (!user) {
        user = new User({ githubId: profile.id, username: profile.username });
        await user.save();
      }
      return done(null, user);
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
};
