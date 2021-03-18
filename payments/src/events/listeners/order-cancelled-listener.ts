import { queueGroupName } from './queue-group-name';
import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@asgettickets/common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    if (!order) {
      throw new Error('Order Not Found');
    }
    order.set({
      status: OrderStatus.Canclled,
    });
    await order.save();

    msg.ack();
  }
}
