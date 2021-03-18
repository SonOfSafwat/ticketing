import { TicketUpdatedPublisher } from './../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';
import { Listener, OrderCancelledEvent, Subjects } from '@asgettickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: { id: string; version: number; ticket: { id: string } },
    msg: Message
  ) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error('Ticket Not Found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
      orderId: ticket.orderId,
      userId: ticket.userId,
    });
    msg.ack();
  }
}
