import Joi from 'joi';

export const billingSchemas = {
  subscribe: Joi.object({
    planId: Joi.string().required(),
    paymentMethodId: Joi.string().required()
  }),
  upgrade: Joi.object({
    planId: Joi.string().required()
  })
};
