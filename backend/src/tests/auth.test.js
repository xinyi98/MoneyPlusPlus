const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const User = require('../mongodb/models/user/schema');

const authRoutes = require('../routes/auth');

let mongod;
let app;
let server;
let user;

beforeAll(async (done) => {
  mongod = new MongoMemoryServer();

  const connectionString = await mongod.getUri();
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  server = app.listen(8000, () => done());
});

beforeEach(async () => {
  const password = await bcrypt.hash('testPassword', 10);
  const collection = await mongoose.connection.db.createCollection('users');
  user = new User({
    username: 'testUser1',
    password,
  });

  await collection.insertOne(user);
});

afterAll(async (done) => {
  server.close(async () => {
    await mongoose.disconnect();
    await mongod.stop();
    done();
  });
});

afterEach(async () => {
  await mongoose.connection.db.dropCollection('users');
});

describe('Authentication test', () => {
  it('Sign up new user', async (done) => {
    await axios
      .post('http://localhost:8000/api/auth/register', {
        username: 'testUser2',
        password: 'testPassword',
      })
      .then((res) => {
        expect(res.status).toBe(201);
      });
    done();
  });

  it('Sign up new user with invalid username', async (done) => {
    try {
      await axios
        .post('http://localhost:8000/api/auth/register', {
          username: 'test U',
          password: 'testPassword',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.status).toBe('error');
      expect(err.response.data.error).toBe('Invalid username');
    }

    done();
  });

  it('Sign up new user with short password', async (done) => {
    try {
      await axios
        .post('http://localhost:8000/api/auth/register', {
          username: 'testUser3',
          password: 'test',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.status).toBe('error');
      expect(err.response.data.error).toBe(
        'Password too small. Should be at least 6 characters',
      );
    }

    done();
  });

  it('Sign up new user with invalid password', async (done) => {
    try {
      await axios
        .post('http://localhost:8000/api/auth/register', {
          username: 'testUser3',
          password: 123,
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.status).toBe('error');
      expect(err.response.data.error).toBe('Invalid password');
    }

    done();
  });

  it('Sign up new user that already exist', async (done) => {
    try {
      await axios
        .post('http://localhost:8000/api/auth/register', {
          username: 'testUser1',
          password: 'testPassword',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(400);
      expect(err.response.data.error).toBe('Duplicate username');
    }
    done();
  });

  it('Log in with existing user', async (done) => {
    await axios
      .post('http://localhost:8000/api/auth/login', {
        username: 'testUser1',
        password: 'testPassword',
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty('token');
      });
    done();
  });

  it('Log in with inexistent user', async (done) => {
    try {
      await axios
        .post('http://localhost:8000/api/auth/login', {
          username: 'testUser',
          password: 'testPassword',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.error).toBe('Incorrect user credentials');
    }
    done();
  });

  it('Log in with existing user with incorrect password', async (done) => {
    try {
      await axios
        .post('http://localhost:8000/api/auth/login', {
          username: 'testUser1',
          password: 'testWrongPassword',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.error).toBe('Incorrect user credentials');
    }
    done();
  });

  it('Log in with invalid username', async (done) => {
    try {
      await axios
        .post('http://localhost:8000/api/auth/login', {
          password: 'testPassword',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe('error');
      expect(err.response.data.error).toBe('Incorrect user credentials');
    }

    done();
  });

  it('Log in with invalid password', async (done) => {
    try {
      await axios
        .post('http://localhost:8000/api/auth/login', {
          username: 'testPassword',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe('error');
      expect(err.response.data.error).toBe('Incorrect user credentials');
    }

    done();
  });
});
