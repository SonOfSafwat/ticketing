import { queueGroupName } from './queue-group-name';
import {
  DatabaseConnectionError,
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from '@asgettickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: {
      id: string;
      status: OrderStatus;
      userId: string;
      expiresAt: string;
      version: number;
      ticket: { id: string; price: number };
    },
    msg: Message
  ) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      version: data.version,
      userId: data.userId,
      status: data.status,
    });
    await order.save();
    msg.ack();
  }
}
