import { natsWrapper } from './../nats-wrapper';
import { PaymentCreatedPublisher } from './../events/publishers/payment-created-publisher';
import {
  NotFoundError,
  OrderStatus,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
} from '@asgettickets/common';

import { body } from 'express-validator';
import { requireAuth } from '@asgettickets/common';
import express, { Request, Response } from 'express';

import { Order } from '../models/order';

import { stripe } from '../stripe';
import { Payment } from '../models/payments';
const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Canclled) {
      throw new BadRequestError('Cannot pay for a cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({ id: payment.id });
  }
);

export { router as CreateChargeRouter };
