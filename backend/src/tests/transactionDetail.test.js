const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const axios = require('axios');
const bcrypt = require('bcryptjs');

const User = require('../mongodb/models/user/schema');
const TransactionDetail = require('../mongodb/models/transactionDetail/schema');
const financialStatementRoutes = require('../routes/financialStatement');
const authRoutes = require('../routes/auth');

let mongod;
let app;
let server;
let user;
let userId;
let token;
let transactionDetail1;
let user2;
let userId2;
let transactionDetail2;

let detail1;
let detail2;
let detail3;
let detail4;
let detail5;
let detail6;
let detail7;
let detail8;

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
  app.use('/api/financial-statement', financialStatementRoutes);
  server = app.listen(8002, () => done());
});

beforeEach(async () => {
  const password = await bcrypt.hash('testPassword', 10);
  const userCollection = await mongoose.connection.db.createCollection('users');
  user = new User({
    username: 'testUser1',
    password,
  });
  user2 = new User({
    username: 'testUser2',
    password,
  });

  await userCollection.insertMany([user, user2]);
  // eslint-disable-next-line no-underscore-dangle
  userId = user._id;
  // eslint-disable-next-line no-underscore-dangle
  userId2 = user2._id;

  await axios
    .post('http://localhost:8002/api/auth/login', {
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

describe('Test transaction detail endpoints with invalid authentication and empty database', () => {
  it('Get financial statement without token', async (done) => {
    try {
      await axios
        .get('http://localhost:8002/api/financial-statement', {
          params: {
            type: '',
            period: 'last_week',
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

  it('Get financial statement with invalid token', async (done) => {
    try {
      await axios
        .get('http://localhost:8002/api/financial-statement', {
          params: {
            type: '',
            period: 'last_week',
          },
          headers: {
            Authorization: 'Bearer abcd',
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

  it('Post financial statement without token', async (done) => {
    try {
      await axios
        .post('http://localhost:8002/api/financial-statement', {
          type: 'expense',
          date: new Date('2021-05-07'),
          category: 'food',
          amount: '100',
          description: 'buy food',
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
    done();
  });

  it('Post financial statement with invalid token', async (done) => {
    try {
      await axios
        .post(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: new Date('2021-05-07'),
            category: 'food',
            amount: '100',
            description: 'buy food',
          },
          {
            headers: {
              Authorization: 'Bearer abcd',
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

  it('Get financial statement summary category without token', async (done) => {
    try {
      await axios
        .get('http://localhost:8002/api/financial-statement/category-summary', {
          params: {
            type: 'expense',
            period: 'last_year',
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

  it('Get financial statement summary category with invalid token', async (done) => {
    try {
      await axios
        .get('http://localhost:8002/api/financial-statement/category-summary', {
          params: {
            type: 'expense',
            period: 'last_year',
          },
          headers: {
            Authorization: 'Bearer abcd',
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

  it('Get financial statement summary category, with invalid type', async (done) => {
    try {
      await axios
        .get('http://localhost:8002/api/financial-statement/category-summary', {
          params: {
            type: '',
            period: 'last_year',
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(400);
    }

    done();
  });
});

it('Get financial statement total without token', async (done) => {
  try {
    await axios
      .get('http://localhost:8002/api/financial-statement/total', {
        params: {
          type: 'expense',
          period: 'last_year',
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

it('Get financial statement total with invalid token', async (done) => {
  try {
    await axios
      .get('http://localhost:8002/api/financial-statement/total', {
        params: {
          type: 'expense',
          period: 'last_year',
        },
        headers: {
          Authorization: 'Bearer abcd',
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

it('Get financial statement daily summary without token', async (done) => {
  try {
    await axios
      .get('http://localhost:8002/api/financial-statement/daily-summary', {
        params: {
          period: 'last_year',
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

it('Get financial statement daily summary with invalid token', async (done) => {
  try {
    await axios
      .get('http://localhost:8002/api/financial-statement/daily-summary', {
        params: {
          period: 'last_year',
        },
        headers: {
          Authorization: 'Bearer abcd',
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

describe('Test transaction detail endpoints with empty database', () => {
  it('Get financial statement with valid token', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: '',
          period: 'last_week',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList).toStrictEqual([]);
      });
    done();
  });
});

describe('Test Transaction detail endpoints with mock database', () => {
  beforeEach(async (done) => {
    const transactionDetailCollection = await mongoose.connection.db.createCollection(
      'transactiondetails',
    );
    detail1 = new TransactionDetail({
      type: 'expense',
      date: new Date('2021-05-07'),
      category: 'food',
      amount: '100',
      description: 'buy food',
      owner: mongoose.Types.ObjectId(userId),
    });
    detail2 = new TransactionDetail({
      type: 'income',
      date: new Date('2021-05-07'),
      category: 'salary',
      amount: '1000',
      description: 'salary',
      owner: mongoose.Types.ObjectId(userId),
    });
    detail3 = new TransactionDetail({
      type: 'expense',
      date: new Date('2021-04-30'),
      category: 'travel',
      amount: '300',
      description: 'go to travel',
      owner: mongoose.Types.ObjectId(userId),
    });
    detail4 = new TransactionDetail({
      type: 'income',
      date: new Date('2021-01-01'),
      category: 'salary',
      amount: '1000',
      description: 'salary',
      owner: mongoose.Types.ObjectId(userId),
    });
    detail5 = new TransactionDetail({
      type: 'income',
      date: new Date('2021-03-01'),
      category: 'salary',
      amount: '1000',
      description: 'salary',
      owner: mongoose.Types.ObjectId(userId),
    });
    detail6 = new TransactionDetail({
      type: 'expense',
      date: new Date('2020-12-01'),
      category: 'travel',
      amount: '500',
      description: 'go to travel',
      owner: mongoose.Types.ObjectId(userId),
    });
    detail7 = new TransactionDetail({
      type: 'expense',
      date: new Date('2020-06-01'),
      category: 'travel',
      amount: '500',
      description: 'go to travel',
      owner: mongoose.Types.ObjectId(userId),
    });
    detail8 = new TransactionDetail({
      type: 'expense',
      date: new Date('2020-06-01'),
      category: 'travel',
      amount: '500',
      description: 'user2',
      owner: mongoose.Types.ObjectId(userId2),
    });
    await transactionDetailCollection.insertMany([
      detail1,
      detail2,
      detail3,
      detail4,
      detail5,
      detail6,
      detail7,
      detail8,
    ]);

    // transactionDetail1 = await TransactionDetail.findOne({
    //   category: 'food',
    // }).then(() => done());
    // done();

    transactionDetail1 = await TransactionDetail.findOne({ category: 'food' });
    transactionDetail2 = await TransactionDetail.findOne({
      description: 'user2',
    });

    done();
  });

  it('Get financial statement - all type, no period', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: '',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList.length).toBe(7);
      });
    done();
  });

  it('Get financial statement - all type, last week', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: '',
          period: 'last_week',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList.length).toBe(2);
      });
    done();
  });

  it('Get financial statement - all type, last month', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: '',
          period: 'last_month',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList.length).toBe(3);
      });
    done();
  });

  it('Get financial statement - all type, last three month', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: '',
          period: 'last_three_months',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList.length).toBe(4);
      });
    done();
  });

  it('Get financial statement - all type, last six month', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: '',
          period: 'last_six_months',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList.length).toBe(6);
      });
    done();
  });

  it('Get financial statement - all type, last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: '',
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList.length).toBe(7);
      });
    done();
  });

  it('Get financial statement - income type, last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: 'income',
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList.length).toBe(3);
      });
    done();
  });

  it('Get financial statement - expense type, last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement', {
        params: {
          type: 'expense',
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.detailList.length).toBe(4);
      });
    done();
  });

  it('Post financial statement with valid token, but invalid type', async (done) => {
    try {
      await axios
        .post(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'eee',
            date: new Date('2021-05-07'),
            category: 'food',
            amount: '100',
            description: 'buy food',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  it('Post financial statement with valid token and type but invalid amount', async (done) => {
    try {
      await axios
        .post(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: new Date('2021-05-07'),
            category: 'food',
            amount: '-100',
            description: 'buy food',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  it('Post financial statement with invalid date', async (done) => {
    try {
      await axios
        .post(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: '2021-05-07-1',
            category: 'food',
            amount: '100',
            description: 'buy food',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  it('Post financial statement with missing category', async (done) => {
    try {
      await axios
        .post(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: new Date('2021-05-07'),
            amount: '100',
            description: 'buy food',
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  it('Post financial statement with valid information', async (done) => {
    await axios
      .post(
        'http://localhost:8002/api/financial-statement',
        {
          type: 'expense',
          date: new Date('2021-05-08'),
          category: 'drink',
          amount: '100',
          description: 'buy drink',
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

  it('Post financial statement with valid information', async (done) => {
    await axios
      .post(
        'http://localhost:8002/api/financial-statement',
        {
          type: 'expense',
          date: new Date('2021-05-08'),
          category: 'drink',
          amount: 100,
          description: 'buy drink',
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

    const details = await TransactionDetail.find();
    expect(details.length).toBe(9);
    expect(details[8].type).toBe('expense');
    expect(details[8].category).toBe('drink');
    expect(details[8].amount).toBe(100);
    expect(details[8].date).toStrictEqual(new Date('2021-05-08'));
    done();
  });

  it('Get financial statement total, type = all, period = last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement/total', {
        params: {
          type: '',
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe('true');
        expect(res.data.result).toBe(1600);
      });
    done();
  });

  it('Get financial statement total, type = income, period = last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement/total', {
        params: {
          type: 'income',
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe('true');
        expect(res.data.result).toBe(3000);
      });
    done();
  });

  it('Get financial statement total, type = expense, period = last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement/total', {
        params: {
          type: 'expense',
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe('true');
        expect(res.data.result).toBe(1400);
      });
    done();
  });

  it('Get financial statement summary category, type = income, period = last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement/category-summary', {
        params: {
          type: 'income',
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.summary).toStrictEqual([
          { category: 'salary', totalNumber: 3000 },
        ]);
      });
    done();
  });

  it('Get financial statement summary category, type = expense, period = last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement/category-summary', {
        params: {
          type: 'expense',
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.summary).toStrictEqual([
          { category: 'travel', totalNumber: 1300 },
          { category: 'food', totalNumber: 100 },
        ]);
      });
    done();
  });

  it('Get financial statement daily summary, period = last year', async (done) => {
    await axios
      .get('http://localhost:8002/api/financial-statement/daily-summary', {
        params: {
          period: 'last_year',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.data.success).toBe(true);
        expect(res.data.summary).toStrictEqual([
          { date: '2020-06-01', netIncome: -500 },
          { date: '2020-12-01', netIncome: -500 },
          { date: '2021-01-01', netIncome: 1000 },
          { date: '2021-03-01', netIncome: 1000 },
          { date: '2021-04-30', netIncome: -300 },
          { date: '2021-05-07', netIncome: 900 },
        ]);
      });
    done();
  });

  it('Put financial statement with valid information', async (done) => {
    await axios
      .put(
        'http://localhost:8002/api/financial-statement',
        {
          type: 'expense',
          date: new Date('2021-05-08'),
          category: 'drink',
          amount: 90,
          description: 'buy drink',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: transactionDetail1.id,
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(204);
      });

    const details = await TransactionDetail.find();
    expect(details.length).toBe(8);
    expect(details[0].amount).toBe(90);

    done();
  });

  it('Put financial statement with no information', async (done) => {
    await axios
      .put(
        'http://localhost:8002/api/financial-statement',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            id: transactionDetail1.id,
          },
        },
      )
      .then((res) => {
        expect(res.status).toBe(204);
      });

    const details = await TransactionDetail.find();
    expect(details.length).toBe(8);
    expect(details[0].amount).toBe(100);

    done();
  });

  it('Put financial statement without token', async (done) => {
    try {
      await axios
        .put(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: new Date('2021-05-08'),
            category: 'drink',
            amount: 90,
            description: 'buy drink',
          },
          {
            params: {
              id: transactionDetail1.id,
            },
          },
        )
        .then(() => {
          fail('Should have failed here');
        });
    } catch (err) {
      expect(err.response.status).toBe(401);
    }
    done();
  });

  it('Put financial statement with invalid token', async (done) => {
    try {
      await axios
        .put(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: new Date('2021-05-08'),
            category: 'drink',
            amount: 90,
            description: 'buy drink',
          },
          {
            headers: {
              Authorization: 'Bearer abcd',
            },
            params: {
              id: transactionDetail1.id,
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

  it('Put financial statement with invalid amount', async (done) => {
    try {
      await axios
        .put(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: new Date('2021-05-08'),
            category: 'drink',
            amount: -90,
            description: 'buy drink',
          },
          {
            headers: {
              Authorization: 'Bearer abcd',
            },
            params: {
              id: transactionDetail1.id,
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

  it('Put financial statement with invalid detail id', async (done) => {
    try {
      await axios
        .put(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: new Date('2021-05-08'),
            category: 'drink',
            amount: 90,
            description: 'buy drink',
          },
          {
            headers: {
              Authorization: 'Bearer abcd',
            },
            params: {
              id: '111',
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

  it('Put financial statement with other user detail id', async (done) => {
    try {
      await axios
        .put(
          'http://localhost:8002/api/financial-statement',
          {
            type: 'expense',
            date: new Date('2021-05-08'),
            category: 'drink',
            amount: 90,
            description: 'buy drink',
          },
          {
            headers: {
              Authorization: 'Bearer abcd',
            },
            params: {
              id: transactionDetail2.id,
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

  it('Delete financial statement with valid information', async (done) => {
    await axios
      .delete('http://localhost:8002/api/financial-statement', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          detailId: transactionDetail1.id,
        },
      })
      .then((res) => {
        expect(res.status).toBe(204);
      });

    const details = await TransactionDetail.find();
    expect(details.length).toBe(7);
    done();
  });

  it('Delete financial statement without token', async (done) => {
    try {
      await axios
        .delete('http://localhost:8002/api/financial-statement', {
          params: {
            detailId: transactionDetail1.id,
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

  it('Delete financial statement with invalid token', async (done) => {
    try {
      await axios
        .delete('http://localhost:8002/api/financial-statement', {
          headers: {
            Authorization: 'Bearer abcd',
          },
          params: {
            detailId: transactionDetail1.id,
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

  it('Delete financial statement with invalid detail id', async (done) => {
    try {
      await axios
        .delete('http://localhost:8002/api/financial-statement', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            detailId: '111',
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
});
