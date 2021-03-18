import { queueGroupName } from './queue-group-name';
import { Listener, Subjects, TicketUpdatedEvent } from '@asgettickets/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';

export class TicketUpdatedlistener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;
  async onMessage(
    data: {
      id: string;
      title: string;
      price: number;
      userId: string;
      version: number;
    },
    msg: Message
  ) {
    const ticket = await Ticket.findByEvent(data);
    if (!ticket) {
      throw new Error('Ticket Not Found');
    }

    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
