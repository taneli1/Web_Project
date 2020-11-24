'use strict';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');

// local strategy for username password login
passport.use(new LocalStrategy(
    async (username, password, done) => {
      const params = [username];
      try {
        const [user] = await userModel.getUserLogin(params);
        console.log('Local strategy', user); // result is binary row
        if (user === undefined) {
          return done(null, false, {message: 'Incorrect email.'});
        }
        // Check if pws match
        if (!bcrypt.compareSync(password, user.password)) { // passwords dont match
          console.log("User pw:" , user.password)
          console.log('pws dont match');
          return done(null, false);
        }
        return done(null, {...user}, {message: 'Logged In Successfully'}); // use spread syntax to create shallow copy to get rid of binary row type
      }
      catch (err) {
        return done(err);
      }
    }));


passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'testing',
    },
    async (jwtPayload, done) => {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        console.log('jwtPayload', jwtPayload)
        const user = await userModel.getUser(jwtPayload.user_id);
        if (user === undefined) {
          return done(null, false);
        }
        const plainUser = {...user};
        return done(null, plainUser);
      }
      catch (err) {
        return done(err);
      }
    },
));

module.exports = passport;
