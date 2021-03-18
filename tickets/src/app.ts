import { currentUser } from '@asgettickets/common';
import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { errorHandler } from '@asgettickets/common';
import { NotFoundError } from '@asgettickets/common';

import CookieSession from 'cookie-session';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';
const port = 3000;
const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
  CookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
