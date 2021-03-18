import { OrderCreatedEvent, Publisher, Subjects } from '@asgettickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
