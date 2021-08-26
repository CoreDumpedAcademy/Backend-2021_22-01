const User = require('../models/userModel');
const token = require('../services/token');

function getUsers(request, response) {
  const selection = request.body;

  User.find(selection, (error, users) => {
    if (error) return response.status(400).send({ message: 'No users found', error });

    return response.status(200).send(users);
  });
}

function getUserById(request, response) {
  const { userID } = request.params;

  User.findById(userID, (error, user) => {
    if (error) return response.status(400).send({ message: 'No user found', error });

    return response.status(200).send(user);
  });
}

function createUser(request, response) {
  const user = new User(request.body);

  user.save((error, newUser) => {
    if (error) return response.status(400).send({ message: 'Error saving user', error });

    return response.status(200).send(newUser);
  });
}

function updateUser(request, response) {
  const { userID } = request.params;
  const newValues = request.body;

  const updateOptions = {
    runValidators: true,
    strict: true,
  };

  User.findByIdAndUpdate(userID, newValues, updateOptions, (error, updatedUser) => {
    if (error) return response.status(400).send({ message: 'Error updating user', error });

    return response.status(200).send(updatedUser);
  });
}

function deleteUser(request, response) {
  const { userID } = request.params;

  User.findByIdAndDelete(userID, (error, deletedUser) => {
    if (error) return response.status(400).send({ message: 'Error deleting user', error });

    return response.status(200).send(deletedUser);
  });
}

function login(request, response) {
  const { email } = request.body;
  const { password } = request.body;

  let match = false;
  let userToken = '';

  User.findOne({ email }, (error, user) => {
    if (error) return response.status(400).send({ error });
    if (!user) return response.status(403).send({ message: 'Authentication error' });

    match = user.comparePassword(password);

    if (!match) return response.status(403).send({ message: 'Authentication error' });

    userToken = token.createToken(user);

    return response.status(200).send({ user, userToken });
  });
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
};
