const app = require("../../app");
const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

const { TEST_DB_HOST } = process.env;
const { User } = require("../../model/user");

describe("test auth", () => {
  let server;
  beforeAll(() => (server = app.listen(3000)));
  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(TEST_DB_HOST).then(() => done());
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  test("test login route", async () => {
    const loginData = {
      email: "qwerty1@gmail.com",
      password: "456789",
    };
    const response = await request(app).post("/api/auth/login").send(loginData);

    expect(response.statusCode).toBe(200);

    const user = await User.findOne(response.body);
    expect(user.email).toBe(loginData.email);
    expect(user.subscription).toBe("starter");
    expect(user.token).toBeTruthy();
    expect(user.token).not.toBeNull();
  });
});
