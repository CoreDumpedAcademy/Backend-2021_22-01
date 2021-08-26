const tokenService = require('../services/token');

function isLoggedIn(request, response, next) {
  const { token } = request.headers;
  const tokenData = tokenService.verifyToken(token);

  if (!tokenData) return response.status(401).send({ message: 'Wrong credentials' });

  return next();
}

function isSuperUser(request, response, next) {
  const { token } = request.headers;
  const tokenData = tokenService.verifyToken(token);

  if (!tokenData.data.isAdmin) return response.status(403).send({ message: 'Wrong credentials' });

  return next();
}

module.exports = {
  isLoggedIn,
  isSuperUser,
};
