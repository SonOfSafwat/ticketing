import request from "supertest";
import { app } from "../../app";

it("should return 201 on successfull signup", async () => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "P@ssw0rd",
    })
    .expect(201);
});
it("should return 400 on invalid email signup", async () => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "P@ssw0rd",
    })
    .expect(400);
});
it("should return 400 on invalid password signup", async () => {
  request(app)
    .post("/api/users/signup")
    .send({
      email: "test",
      password: "P",
    })
    .expect(400);
});

it("should return 400 on missing email and password", async () => {
  request(app).post("/api/users/signup").send({}).expect(400);
});

it("should disallow duplicate eamils", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "Password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "Password",
    })
    .expect(400);
});
it("should set a cookie after successfull signup", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "Password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
