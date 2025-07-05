import Joi from 'joi';

export const commonSchemas = {
  id: Joi.string().required().min(1),
  
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    sort: Joi.string().valid('name', 'createdAt', 'updatedAt', 'size').default('createdAt'),
    order: Joi.string().valid('asc', 'desc').default('desc')
  })
};
