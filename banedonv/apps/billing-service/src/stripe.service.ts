import Stripe from 'stripe';
import { config } from '@banedonv/shared/src/config';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripeSecretKey || '', {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(customerId: string, priceId: string) {
    return this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
    });
  }

  async handleWebhook(payload: any, signature: string) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
