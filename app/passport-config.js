const localStrategy = require('passport-local').Strategy
const RemeberMeStrategy = require('passport-remember-me').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/user')
const Token = require('./models/token')
const utils = require('./utils')


function initializePassport(passport, getUserByUsername) {
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

    passport.use(new RemeberMeStrategy(
        async function(token_value, done) {
            const token = new Token()
            await consumeRememberMeToken(token_value, async function(err, id) {
                if (err) {return done(err)}
                if (!id) {return done(null, false)}
                try {
                    var user = await User.findById(id)
                } catch (err) {
                    return done(err)
                }
                if (!user) {return done(null, false)}
                return done(null, user)
                
            })
        }, issueToken
    ))
};

async function issueToken(user, done) {
    const token = new Token({username: user.username, user_id: user._id})
    token.save()
    return done(null, token.tokenValue)
}

async function consumeRememberMeToken(token_value, callback_fn) {
    // select a user_id based on a token value
    let user_id
    const currentDate = utils.todayPlusDays(0)
    const date = utils.todayPlusDays(-1)
    console.log('consumer called')
    // try {
    //     r = await Token.findOne({tokenValue: token_value, validToDttm: { $gt: currentDate() } })
        
    // } catch (err) {
    //     console.error('There has been an error while selecting the user_id.')
    //     console.error(err)
    // }
         
   // invalidate the single-use tokenand seleect
   let token
    try {
        // get current date and subtract 1 day        
        token = await Token.findOneAndUpdate(
            {tokenValue: token_value, validToDttm: { $gt: currentDate() }},
            {validToDttm: date()},
            { new: true }
        )
        if (token === null) {
            return callback_fn(null, null)
        }
        token.save()
    } catch (err) {
        console.error('There has been an error while invalidating the token and selecting user_id.')
        console.error(err)
    }
  
    user_id = token.user_id
    console.log(`Consumed a token ${token_value} for user_id = ${user_id}.`)
    return callback_fn(null, user_id);
}

module.exports = {initializePassport, issueToken, consumeRememberMeToken}