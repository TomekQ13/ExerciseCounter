const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user')

function initialize(passport, getUserByUsername) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username);
        if (user == null) {return done(null, false, {message: 'Taki użytkownik nie istnieje'})};
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user, {message: 'Zalogowano pomyślnie'});
            } else {
                return done(null, false, {message: 'Niepoprawne hasło'});
            }
        } catch (e) {
            return done(e);
        };
    };

    passport.use(new localStrategy({ usernameField: 'username', passwordField: 'password' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((_id, done) => {
        User.findById( _id, (err, user) => {
          if(err){
              done(null, false, {error:err});
          } else {
              done(null, user);
          }
        });
    });
};

module.exports = initialize