'use strict';
<<<<<<< HEAD
=======

const TAG = 'passport:'
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcryptjs');

<<<<<<< HEAD
// local strategy for username password login
=======
/**
 * Local Strategy for username password login
 */
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
passport.use(new LocalStrategy(
    async (username, password, done) => {
      const params = [username];
      try {
        const [user] = await userModel.getUserLogin(params);
<<<<<<< HEAD
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
=======
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
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
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
<<<<<<< HEAD
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
=======
      // find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
>>>>>>> 972094a188db4f36c1a627374b127382f49eedfb
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
