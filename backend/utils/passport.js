'use strict';

const TAG = 'passport:'
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');

/**
 * Local Strategy for username password login
 */
passport.use(new LocalStrategy(
    async (username, password, done) => {
      const params = [username];
      try {
        const [user] = await userModel.getUserLogin(params);
        // console.log('Local strategy', user);
        if (user === undefined) {
          return done(null, false, {message: 'Incorrect email.'});
        }

        const check = await bcrypt.compareSync(password, user.password)
        // Compare passwords, wait to get both params first
        if (!check) {
          console.log(`.${password}.`, "||" , `.${user.password}.` )
          console.log(TAG , "PW err, most likely don't match");
          return done(null, false);
        }
        // PWs match
        return done(null, {...user}, {message: 'Logged In Successfully'});
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
      // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      try {
        console.log('jwtPayload', jwtPayload)
        const user = await userModel.getUserById(jwtPayload.user_id);
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
