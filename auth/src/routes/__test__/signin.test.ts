import request from "supertest";
import { app } from "../../app";
it("fails when email that doesnot exit is supplied", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test2@test.com",
      password: "P@ssw0rd",
    })
    .expect(400);
});

it("fails when incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "P@ssw0rd" })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "P@ssw0rd1",
    })
    .expect(400);
});

it("responds with cookie when given valid cerdtionals", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test2@test.com", password: "P@ssw0rd" })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test2@test.com",
      password: "P@ssw0rd",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
