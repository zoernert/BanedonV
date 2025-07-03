const TIER_LIMITS = {
  FREE: { apiCalls: 100, storage: 100 * 1024 * 1024, collections: 1 },
  PRO: { apiCalls: 10000, storage: 1 * 1024 * 1024 * 1024, collections: 5 },
  ULTRA: { apiCalls: 100000, storage: 10 * 1024 * 1024 * 1024, collections: 20 },
  UNLIMITED: { apiCalls: -1, storage: -1, collections: -1 },
};

export class UsageTracker {
  getTierLimits(tier: keyof typeof TIER_LIMITS) {
    return TIER_LIMITS[tier];
  }

  hasExceededLimit(tier: keyof typeof TIER_LIMITS, usage: { apiCalls: number; storage: number; collections: number }) {
    const limits = this.getTierLimits(tier);
    if (limits.apiCalls !== -1 && usage.apiCalls > limits.apiCalls) {
      return true;
    }
    if (limits.storage !== -1 && usage.storage > limits.storage) {
      return true;
    }
    if (limits.collections !== -1 && usage.collections > limits.collections) {
      return true;
    }
    return false;
  }
}
