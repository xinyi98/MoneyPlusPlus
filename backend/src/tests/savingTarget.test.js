const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const User = require('../mongodb/models/user/schema');
const SavingTarget = require('../mongodb/models/savingTarget/schema');

const savingTargetRoutes = require('../routes/savingTarget');
const authRoutes = require('../routes/auth');

let mongod;
let app;
let server;
let user;
let userId;
let longTermTarget;
let shortTermTarget;
let token;

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
  app.use('/api/saving-target', savingTargetRoutes);
  server = app.listen(8001, () => done());
});

beforeEach(async () => {
  const password = await bcrypt.hash('testPassword', 10);
  const userCollection = await mongoose.connection.db.createCollection('users');
  user = new User({
    username: 'testUser1',
    password,
  });
  await userCollection.insertOne(user);
  // eslint-disable-next-line no-underscore-dangle
  userId = user._id;

  await axios
    .post('http://localhost:8001/api/auth/login', {
      username: 'testUser1',
      password: 'testPassword',
    })
    .then((res) => {
      token = res.data.token;
    });
});

afterAll(async (done) => {
  server.close(async () => {
    await mongoose.disconnect();
    await mongod.stop();
    done();
  });
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('Saving target test. Current state is empty', () => {
  it('Get saving target without token', async (done) => {
    try {
      await axios
        .get('http://localhost:8001/api/saving-target', {
          params: {
            type: 'shortTerm',
          },
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
    done();
  });

  it('Get saving target with incorrect token', async (done) => {
    try {
      await axios
        .get('http://localhost:8001/api/saving-target', {
          params: {
            type: 'shortTerm',
          },
          headers: {
            Authorization: 'Bearer abcdefg',
          },
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(403);
    }
    done();
  });

  it('post saving target without token', async (done) => {
    try {
      await axios
        .post('http://localhost:8001/api/saving-target', {
          type: 'shortTerm',
          endDate: '2022-01-01',
          target: '100000',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
    done();
  });

  it('post saving target with incorrect token', async (done) => {
    try {
      await axios
        .post(
          'http://localhost:8001/api/saving-target',
          {
            type: 'shortTerm',
            endDate: '2022-01-01',
            target: '100000',
          },
          {
            headers: {
              Authorization: 'Bearer abcdefg',
            },
          },
        )
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(403);
    }
    done();
  });

  it('delete saving target without token', async (done) => {
    try {
      await axios
        .delete('http://localhost:8001/api/saving-target', {
          params: {
            type: 'shortTerm',
          },
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
    done();
  });

  it('delete saving target with incorrect token', async (done) => {
    try {
      await axios
        .delete('http://localhost:8001/api/saving-target', {
          params: {
            type: 'shortTerm',
          },
          headers: {
            Authorization: 'Bearer abcdefg',
          },
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(403);
    }
    done();
  });

  it('Set a new short-term target', async (done) => {
    await axios
      .post(
        'http://localhost:8001/api/saving-target',
        {
          type: 'shortTerm',
          endDate: '2022-01-01',
          target: '100000',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(201);
      });
    done();
  });

  it('Set a new long-term target', async (done) => {
    await axios
      .post(
        'http://localhost:8001/api/saving-target',
        {
          type: 'longTerm',
          endDate: '2022-01-01',
          target: '100000',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(201);
      });
    done();
  });

  it('Get short-term target but inexistent', async (done) => {
    await axios
      .get('http://localhost:8001/api/saving-target', {
        params: { type: 'shortTerm' },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.result).toStrictEqual({});
      });
    done();
  });

  it('Get long-term target but inexistent', async (done) => {
    await axios
      .get('http://localhost:8001/api/saving-target', {
        params: { type: 'longTerm' },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.result).toStrictEqual({});
      });
    done();
  });
});

describe('Saving target test. Current state has saving target already', () => {
  beforeEach(async () => {
    const savingTargetCollection = await mongoose.connection.db.createCollection(
      'savingtargets',
    );
    shortTermTarget = new SavingTarget({
      type: 'shortTerm',
      endDate: '2022-01-01',
      target: '10000',
      owner: mongoose.Types.ObjectId(userId),
    });
    longTermTarget = new SavingTarget({
      type: 'longTerm',
      endDate: '2023-01-01',
      target: '100000',
      owner: mongoose.Types.ObjectId(userId),
    });
    await savingTargetCollection.insertMany([shortTermTarget, longTermTarget]);
  });

  it('Get existing short term target', async (done) => {
    await axios
      .get('http://localhost:8001/api/saving-target', {
        params: {
          type: 'shortTerm',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.result.targetNumber).toBe(10000);
        expect(res.data.result.endDate).toBe('2022-01-01T00:00:00.000Z');
      });
    done();
  });

  it('Get existing long term target', async (done) => {
    await axios
      .get('http://localhost:8001/api/saving-target', {
        params: {
          type: 'longTerm',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.result.targetNumber).toBe(100000);
        expect(res.data.result.endDate).toBe('2023-01-01T00:00:00.000Z');
      });
    done();
  });

  it('Delete existing short term target', async (done) => {
    await axios
      .delete('http://localhost:8001/api/saving-target', {
        params: {
          type: 'shortTerm',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(204);
      });
    done();
  });

  it('Delete existing long term target', async (done) => {
    await axios
      .delete('http://localhost:8001/api/saving-target', {
        params: {
          type: 'longTerm',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(204);
      });
    done();
  });
});
