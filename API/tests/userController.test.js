/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../server');

describe('getUsers()', () => {
  it('should return all users', async () => {
    await request(app)
      .get('/user')
      .expect(200);
  });
});

describe('getUserById()', () => {
  let userID = '';
  const uniqueNumber = Math.trunc(Math.random() * 100);
  const newUser = {
    email: `testGetUserById(${uniqueNumber})@test.test`,
    password: `${uniqueNumber}`,
    name: `test${uniqueNumber}Name`,
    surname: `test${uniqueNumber}Surname`,
  };

  beforeAll(async () => {
    await request(app)
      .post('/user')
      .send(newUser)
      .then((response) => {
        userID = response.body[0]._id;
      });
  });

  it('should return a user', async () => {
    await request(app)
      .get(`/user/${userID}`)
      .expect(200)
      .then((response) => {
        expect(response.body[0]._id).toEqual(userID);
      });
  });

  it('should not return a user, does not exists', async () => {
    await request(app)
      .get('/user/notAnID')
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('No user found');
      });
  });

  afterAll(async () => {
    await request(app)
      .delete(`/user/${userID}`);
  });
});

describe('createUser()', () => {
  let userID = '';
  let newUserID = '';
  const uniqueNumber = Math.trunc(Math.random() * 100);
  const alreadyRegisteredUser = {
    email: `alreadyRegistered${uniqueNumber}@test.test`,
    password: `${uniqueNumber}`,
    name: `alreadyRegistered${uniqueNumber}Name`,
    surname: `alreadyRegistered${uniqueNumber}Surname`,
  };
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

  beforeAll(async () => {
    await request(app)
      .post('/user')
      .send(alreadyRegisteredUser)
      .then((response) => {
        userID = response.body[0]._id;
      });
  });

  it('should create a user', async () => {
    await request(app)
      .post('/user')
      .send(newUser)
      .expect(200)
      .then((response) => {
        newUserID = response.body[0]._id;
      });
  });

  it('should not create a user, already exists', async () => {
    await request(app)
      .post('/user')
      .send(alreadyRegisteredUser)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Error saving user');
      });
  });

  it('should not create a user, wrong format', async () => {
    await request(app)
      .post('/user')
      .send(wrongFormatUser)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Error saving user');
      });
  });

  afterAll(async () => {
    await request(app)
      .delete(`/user/${userID}`);
    await request(app)
      .delete(`/user/${newUserID}`);
  });
});

describe('updateUser()', () => {
  let userID = '';
  const uniqueNumber = Math.trunc(Math.random() * 100);
  const alreadyRegisteredUser = {
    email: `alreadyRegistered${uniqueNumber}@test.test`,
    password: `${uniqueNumber}`,
    name: `alreadyRegistered${uniqueNumber}Name`,
    surname: `alreadyRegistered${uniqueNumber}Surname`,
  };
  const editedUser = {
    email: `updateUser(${uniqueNumber})@test.test`,
    password: `${uniqueNumber}`,
    name: `test${uniqueNumber}Name`,
    surname: `test${uniqueNumber}Surname`,
  };
  const wrongFormatEditedUser = {
    email: `wrongFormat${uniqueNumber}`,
    password: '',
    name: '',
    surname: '',
  };

  beforeAll(async () => {
    await request(app)
      .post('/user')
      .send(alreadyRegisteredUser)
      .then((response) => {
        userID = response.body[0]._id;
      });
  });

  it('should edit a user', async () => {
    await request(app)
      .patch(`/user/${userID}`)
      .send(editedUser)
      .expect(200)
      .then((response) => {
        expect(response.body[0]._id).toEqual(userID);
      });
  });

  it('should not update a user, does not exists', async () => {
    await request(app)
      .patch('/user/notAnID')
      .send(editedUser)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Error updating user');
      });
  });

  it('should not edit a user, wrong format', async () => {
    await request(app)
      .patch(`/user/${userID}`)
      .send(wrongFormatEditedUser)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Error updating user');
      });
  });

  afterAll(async () => {
    await request(app)
      .delete(`/user/${userID}`);
  });
});

describe('deleteUser()', () => {
  let userID = '';
  const uniqueNumber = Math.trunc(Math.random() * 100);
  const alreadyRegisteredUser = {
    email: `testDeleteUser(${uniqueNumber})@test.test`,
    password: `${uniqueNumber}`,
    name: `test${uniqueNumber}Name`,
    surname: `test${uniqueNumber}Surname`,
  };

  beforeAll(async () => {
    await request(app)
      .post('/user')
      .send(alreadyRegisteredUser)
      .then((response) => {
        userID = response.body[0]._id;
      });
  });

  it('should delete a user', async () => {
    await request(app)
      .delete(`/user/${userID}`)
      .expect(200)
      .then((response) => {
        newUserID = response.body[0]._id;
      });
  });

  it('should not delete a user, does not exists', async () => {
    await request(app)
      .delete('/user/notAnID')
      .expect(400)
      .then((response) => {
        expect(response.body.message).toEqual('Error deleting user');
      });
  });
});

describe('login()', () => {
  let userID = '';
  const uniqueNumber = Math.trunc(Math.random() * 100);
  const newUser = {
    email: `testLogin(${uniqueNumber})@test.test`,
    password: `${uniqueNumber}`,
    name: `test${uniqueNumber}Name`,
    surname: `test${uniqueNumber}Surname`,
  };
  const userCorrectCredential = {
    email: `testLogin(${uniqueNumber})@test.test`,
    password: `${uniqueNumber}`,
  };
  const userIncorrectPassword = {
    email: `testLogin(${uniqueNumber})@test.test`,
    password: 'wrongPassword',
  };
  const userIncorrectEmail = {
    email: 'testLoginWrongEmail@test.test',
    password: `${uniqueNumber}`,
  };

  beforeAll(async () => {
    await request(app)
      .post('/user')
      .send(newUser)
      .then((response) => {
        userID = response.body[0]._id;
      });
  });

  it('should log in', async () => {
    await request(app)
      .post('/user/login')
      .send(userCorrectCredential)
      .expect(200);
  });

  it('should not log in, incorrect email', async () => {
    await request(app)
      .post('/user/login')
      .send(userIncorrectEmail)
      .expect(401)
      .then((response) => {
        expect(response.body.message).toEqual('Authentication error');
      });
  });

  it('should not log in, incorrect password', async () => {
    await request(app)
      .post('/user/login')
      .send(userIncorrectPassword)
      .expect(401)
      .then((response) => {
        expect(response.body.message).toEqual('Authentication error');
      });
  });

  afterAll(async () => {
    await request(app)
      .delete(`/user/${userID}`);
  });
});
