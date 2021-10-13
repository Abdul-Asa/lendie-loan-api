const jwt = require('jsonwebtoken');

function userAuthentication(req, res, next) {
  const token = req.header('token');
  if (!token) return res.send({ message: 'access denied' });
  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = verified;
    if (req.user._id !== req.params.id) {
      res.send({ message: 'wrong user' });
    }
  } catch (err) {
    res.send({ err, message: err.message });
  }
  next();
}

module.exports = { userAuthentication };
