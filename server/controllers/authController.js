const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.validateSignup = (req, res, next) => {
  req.sanitizeBody('name');
  req.sanitizeBody('email');
  req.sanitizeBody('password');

  req.checkBody('name', 'Enter a name').notEmpty();
  req.checkBody('name', 'Name must be between 4 and 10 character').isLength({min: 4, max: 10});

  req.checkBody('email', 'Enter a valid email').isEmail().normalizeEmail();

  req.checkBody('password', 'Enter a password').notEmpty();
  req.checkBody('password', 'Password must be between 4 and 10 character').isLength({min: 4, max: 10});

  const errors = req.validationErrors();
  if(errors) {
    const firstError = errors.map(error => error.msg)[0];
    return res.status(400, firstError);
  }
  next();
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await new User({ name, email, password }).save();
  await User.register(user, password, (error, user) => {
    if(error) {
      return res.status(500).send(error.message);
    }
    return res.json(user);
  });

};

exports.signin = () => {};

exports.signout = () => {};

exports.checkAuth = () => {};
