import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { errorHandler } from '@asgettickets/common';
import { NotFoundError } from '@asgettickets/common';

import CookieSession from 'cookie-session';
import { signupRouter } from './routes/signup';
import { signinRouter } from './routes/signin';
import { currentUserRouter } from './routes/current-user';
import { signoutRouter } from './routes/signout';
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
app.use(signupRouter);
app.use(signinRouter);
app.use(currentUserRouter);
app.use(signoutRouter);
app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
