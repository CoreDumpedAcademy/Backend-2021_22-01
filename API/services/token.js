const jwt = require('jsonwebtoken');

function createToken(user) {
  const payload = {
    data: user,
  };

  return jwt.sign(payload, process.env.KEY, { expiresIn: '750h' });
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.KEY);
  } catch (error) {
    return undefined;
  }
}

module.exports = {
  createToken,
  verifyToken,
};
