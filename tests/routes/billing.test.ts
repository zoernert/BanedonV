import request from 'supertest';
import express from 'express';
import billingRoutes from '../../src/routes/billing';
import '../setup';

describe('Billing Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/billing', billingRoutes);
  });

  describe('GET /billing/subscription', () => {
    it('should return subscription details', async () => {
      const response = await request(app)
        .get('/billing/subscription')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 'sub_1');
      expect(response.body.data).toHaveProperty('plan', 'premium');
      expect(response.body.data).toHaveProperty('status', 'active');
      expect(response.body.data).toHaveProperty('nextBillingDate');
      expect(response.body.data).toHaveProperty('amount', 99.99);
      expect(response.body.data).toHaveProperty('currency', 'USD');
    });
  });

  describe('GET /billing/plans', () => {
    it('should return available plans', async () => {
      const response = await request(app)
        .get('/billing/plans')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(3);
      
      const plans = response.body.data;
      expect(plans[0]).toHaveProperty('id', 'free');
      expect(plans[1]).toHaveProperty('id', 'standard');
      expect(plans[2]).toHaveProperty('id', 'premium');
    });
  });

  describe('POST /billing/subscribe', () => {
    it('should create a new subscription', async () => {
      const subscriptionData = {
        planId: 'premium',
        paymentMethodId: 'pm_card_visa'
      };

      const response = await request(app)
        .post('/billing/subscribe')
        .set(testUtils.getAuthHeaders())
        .send(subscriptionData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('planId', 'premium');
      expect(response.body.data).toHaveProperty('status', 'subscription_created');
    });
  });

  describe('POST /billing/cancel-subscription', () => {
    it('should cancel subscription', async () => {
      const response = await request(app)
        .post('/billing/cancel-subscription')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'subscription_cancelled');
    });
  });

  describe('GET /billing/invoices', () => {
    it('should return invoices', async () => {
      const response = await request(app)
        .get('/billing/invoices')
        .set(testUtils.getAuthHeaders())
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body).toHaveProperty('pagination');
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('total');
    });
  });

  describe('PUT /billing/payment-method', () => {
    it('should update payment method', async () => {
      const paymentData = {
        cardToken: 'tok_visa'
      };

      const response = await request(app)
        .put('/billing/payment-method')
        .set(testUtils.getAuthHeaders())
        .send(paymentData)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('status', 'payment_method_updated');
    });
  });
});
