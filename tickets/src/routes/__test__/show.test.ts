import mongoose from "mongoose";
import { app } from "../../app";
import request from "supertest";

it("returns 404 if the ticket is not found", async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

it("returns a ticket if it's found", async () => {
  const title = "concert";
  const price = 20;
  const ticket = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/tickets/${ticket.body.id}`)
    .send()
    .expect(200);

  expect(response.body.title).toEqual(title);
  expect(response.body.price).toEqual(price);
});
