export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    storage: number;
    users: number;
    apiCalls: number;
  };
}

export interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  nextBillingDate: string;
  amount: number;
  currency: string;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
}

export interface IBillingService {
  getSubscription(userId: string): Promise<Subscription | null>;
  getPlans(): Promise<BillingPlan[]>;
  subscribe(userId: string, planId: string): Promise<Subscription>;
  cancelSubscription(userId: string): Promise<void>;
  getInvoices(userId: string, pagination: any): Promise<any>;
  updatePaymentMethod(userId: string, paymentMethodId: string): Promise<void>;
  getBillingUsage(userId: string): Promise<any>;
}
