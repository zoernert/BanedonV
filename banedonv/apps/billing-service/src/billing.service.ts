import { StripeService } from './stripe.service';

export class BillingService {
  private stripeService: StripeService;

  constructor() {
    this.stripeService = new StripeService();
  }

  async createCheckoutSession(customerId: string, priceId: string) {
    return this.stripeService.createCheckoutSession(customerId, priceId);
  }

  async handleWebhook(payload: any, signature: string) {
    return this.stripeService.handleWebhook(payload, signature);
  }
}
