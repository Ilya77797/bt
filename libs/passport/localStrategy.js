let passport = require('koa-passport');
let LocalStrategy = require('passport-local');
let User = require('../../models/user');

// Стратегия берёт поля из req.body
// Вызывает для них функцию
passport.use(new LocalStrategy({
    usernameField: 'username', // 'username' by default
    passwordField: 'password',
    passReqToCallback: true // all strategies support ctx: req for more complex cases
  },
  // Три возможных итога функции
  // done(null, user[, info]) ->
  //   strategy.success(user, info)
  // done(null, false[, info]) ->
  //   strategy.fail(info)
  // done(err) ->
  //   strategy.error(err)
  function(req, username, password, done) {
    User.findOne({ username }, function(err, user) {
      if (err) {
          console.log('Err: ', err);
        return done(err);
      }

      if (!user || !user.checkPassword(password)) {
        // don't say whether the user exists
        return done(null, false, { message: 'Нет такого пользователя или пароль неверен.' });
      }
        console.log('done: ', user);
      return done(null, user);
    });
  }
));
