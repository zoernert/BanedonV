import Joi from 'joi';

export const searchSchemas = {
  query: Joi.object({
    q: Joi.string().min(1).max(200).required(),
    type: Joi.string().valid('file', 'collection', 'user'),
    owner: Joi.string().max(100),
    tags: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())),
    fileType: Joi.string().max(20),
    dateRange: Joi.string().max(50),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  }),
  suggestions: Joi.object({
    q: Joi.string().min(1).max(200).required()
  })
};
