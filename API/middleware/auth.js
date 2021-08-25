function isLoggedIn(request, response, next) {
  next();
}

function isSuperUser(request, response, next) {
  next();
}

module.exports = {
  isLoggedIn,
  isSuperUser,
};
