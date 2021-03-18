import { queueGroupName } from './queue-group-name';
import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  Subjects,
} from '@asgettickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: { id: string; stripeId: string; orderId: string },
    msg: Message
  ) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
