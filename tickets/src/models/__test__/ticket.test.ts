import { Ticket } from '../ticket';

it('implements optemistic concurrency control', async () => {
  //create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    userId: '2352345323',
  });
  //save the ticket to the database
  await ticket.save();
  //fetch the ticket twice
  const ticketOne = await Ticket.findById(ticket.id);
  const ticketTwo = await Ticket.findById(ticket.id);
  //make two seperate changes to the tickets we fetched
  ticketOne?.set({ price: 20 });
  ticketTwo?.set({ price: 10 });
  //save the first fetched ticket
  await ticketOne?.save();
  //save the second fetched ticket
  await ticketTwo?.save();
});
