/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
/* global beforeAll, beforeEach, afterAll, afterEach, describe, it, expect */

const request = require('supertest');
const app = require('../server');

const superUser = {
  email: 'admin@test.test',
  password: '1234',
};
let user = {};
let superUserToken = '';
let userToken = '';
let userID = '';

beforeAll(async () => {
  await request(app)
    .post('/user/login')
    .send(superUser)
    .then((response) => {
      superUserToken = response.body.userToken;
    });
});

beforeEach(async () => {
  const uniqueNumber = Math.trunc(Math.random() * 100);
  user = {
    email: `beforeEach(${uniqueNumber})@test.test`,
    password: `${uniqueNumber}`,
    name: `test${uniqueNumber}Name`,
    surname: `test${uniqueNumber}Surname`,
  };

  await request(app)
    .post('/user')
    .send(user)
    .then((response) => {
      userID = response.body._id;
    });

  await request(app)
    .post('/user/login')
    .send(user)
    .then((response) => {
      userToken = response.body.userToken;
    });
});

afterEach(async () => {
  await request(app)
    .delete(`/user/${userID}`)
    .set({ token: userToken });
});

describe('getUsers()', () => {
  describe('given a valid token of an admin', () => {
    it('should return all users', async () => {
      await request(app)
        .get('/user')
        .set({ token: superUserToken })
        .expect(200);
    });
  });
  describe('given a valid token of a user', () => {
    it('should not return all users', async () => {
      await request(app)
        .get('/user')
        .set({ token: userToken })
        .expect(403)
        .then((response) => {
          expect(response.body.message).toEqual('Wrong credentials');
        });
    });
  });
  describe('given an invalid token', () => {
    it('should not return all users', async () => {
      await request(app)
        .get('/user')
        .expect(401)
        .then((response) => {
          expect(response.body.message).toEqual('Wrong credentials');
        });
    });
  });
});

describe('getUserById()', () => {
  describe('given a valid token of an admin', () => {
    it('should return a user if userID is valid', async () => {
      await request(app)
        .get(`/user/${userID}`)
        .set({ token: superUserToken })
        .expect(200)
        .then((response) => {
          expect(response.body._id).toEqual(userID);
        });
    });
    it('should not return a user if userID is not valid', async () => {
      await request(app)
        .get('/user/notAnID')
        .set({ token: superUserToken })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('No user found');
        });
    });
  });
  describe('given a valid token of a user', () => {
    it('should not return a user', async () => {
      await request(app)
        .get(`/user/${userID}`)
        .set({ token: userToken })
        .expect(403)
        .then((response) => {
          expect(response.body.message).toEqual('Wrong credentials');
        });
    });
  });
  describe('given an invalid token', () => {
    it('should not return all users', async () => {
      await request(app)
        .get(`/user/${userID}`)
        .expect(401)
        .then((response) => {
          expect(response.body.message).toEqual('Wrong credentials');
        });
    });
  });
});

describe('createUser()', () => {
  const uniqueNumber = Math.trunc(Math.random() * 100);

  const newUser = {
    email: `testCreateUser(${uniqueNumber})@test.test`,
    password: `${uniqueNumber}`,
    name: `test${uniqueNumber}Name`,
    surname: `test${uniqueNumber}Surname`,
  };
  const wrongFormatUser = {
    email: `wrongFormat${uniqueNumber}`,
    password: '',
    name: '',
    surname: '',
  };

  let newUserID = '';

  describe('given a well formatted user', () => {
    it('should create a user if does not exists', async () => {
      await request(app)
        .post('/user')
        .send(newUser)
        .expect(200)
        .then((response) => {
          newUserID = response.body._id;
        });
    });
    it('should not create a user if does exists', async () => {
      await request(app)
        .post('/user')
        .send(user)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('Error saving user');
        });
    });
  });
  describe('given a bad formatted user', () => {
    it('should not create a user', async () => {
      await request(app)
        .post('/user')
        .send(wrongFormatUser)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('Error saving user');
        });
    });
  });

  afterAll(async () => {
    await request(app)
      .delete(`/user/${newUserID}`)
      .set({ token: userToken });
  });
});

describe('updateUser()', () => {
  const uniqueNumber = Math.trunc(Math.random() * 100);

  const validUserChanges = {
    password: '4321',
    name: `testUpdateUser(${uniqueNumber})`,
  };
  const invalidUserChanges = {
    phone: '123456780123490837456',
  };
  const readOnlyUserChanges = {
    email: 'newEmail',
    isAdmin: true,
  };

  describe('given a valid token', () => {
    it('should edit a user if userID and changes are valid', async () => {
      await request(app)
        .patch(`/user/${userID}`)
        .set({ token: userToken })
        .send(validUserChanges)
        .expect(200)
        .then((response) => {
          expect(response.body._id).toEqual(userID);
        });
    });
    it('should not edit a user if changes are on readOnly attributes', async () => {
      await request(app)
        .patch(`/user/${userID}`)
        .set({ token: userToken })
        .send(readOnlyUserChanges)
        .expect(200)
        .then((response) => {
          expect(response.body.email).toEqual(user.email);
        });
    });
    it('should not edit a user if userID is not valid', async () => {
      await request(app)
        .patch('/user/invalidUserID')
        .set({ token: userToken })
        .send(validUserChanges)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('Error updating user');
        });
    });
    it('should not edit a user if changes are not valid', async () => {
      await request(app)
        .patch(`/user/${userID}`)
        .set({ token: userToken })
        .send(invalidUserChanges)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('Error updating user');
        });
    });
  });
  describe('given an invalid token', () => {
    it('should not edit a user', async () => {
      await request(app)
        .patch(`/user/${userID}`)
        .send(validUserChanges)
        .expect(401)
        .then((response) => {
          expect(response.body.message).toEqual('Wrong credentials');
        });
    });
  });
});

describe('deleteUser()', () => {
  const uniqueNumber = Math.trunc(Math.random() * 100);

  const alreadyRegisteredUser = {
    email: `testDeleteUser(${uniqueNumber})@test.test`,
    password: `${uniqueNumber}`,
    name: `test${uniqueNumber}Name`,
    surname: `test${uniqueNumber}Surname`,
  };
  let newUserID = '';
  let newUserToken = '';

  beforeAll(async () => {
    await request(app)
      .post('/user')
      .send(alreadyRegisteredUser)
      .then((response) => {
        newUserID = response.body._id;
      });

    await request(app)
      .post('/user/login')
      .send(alreadyRegisteredUser)
      .then((response) => {
        newUserToken = response.body.userToken;
      });
  });

  describe('given a valid token', () => {
    it('should delete a user', async () => {
      await request(app)
        .delete(`/user/${newUserID}`)
        .set({ token: newUserToken })
        .expect(200)
        .then((response) => {
          expect(newUserID).toEqual(response.body._id);
        });
    });
    it('should not delete a user if userID is not valid', async () => {
      await request(app)
        .delete('/user/invalidUserID')
        .set({ token: newUserToken })
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual('Error deleting user');
        });
    });
  });
  describe('given an invalid token', () => {
    it('should not delete a user', async () => {
      await request(app)
        .delete(`/user/${newUserID}`)
        .expect(401)
        .then((response) => {
          expect(response.body.message).toEqual('Wrong credentials');
        });
    });
  });
});

describe('login()', () => {
  const uniqueNumber = Math.trunc(Math.random() * 100);

  const userIncorrectPassword = {
    email: `testLogin(${uniqueNumber})@test.test`,
    password: 'wrongPassword',
  };
  const userIncorrectEmail = {
    email: user.email,
    password: `${uniqueNumber}`,
  };

  describe('given a registered user', () => {
    it('should log in if email and password are correct', async () => {
      await request(app)
        .post('/user/login')
        .send(user)
        .expect(200)
        .then((response) => {
          expect(response.body.userToken).toBeDefined();
        });
    });
    it('should not log in if email is incorrect', async () => {
      await request(app)
        .post('/user/login')
        .send(userIncorrectEmail)
        .expect(403)
        .then((response) => {
          expect(response.body.message).toEqual('Authentication error');
        });
    });
  });
  describe('given a not registered user', () => {
    it('should not log in if password is incorrect', async () => {
      await request(app)
        .post('/user/login')
        .send(userIncorrectPassword)
        .expect(403)
        .then((response) => {
          expect(response.body.message).toEqual('Authentication error');
        });
    });
  });
});
