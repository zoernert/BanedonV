import Joi from 'joi';

export const collectionSchemas = {
  create: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    description: Joi.string().max(500),
    tags: Joi.array().items(Joi.string()),
    isPublic: Joi.boolean().default(false),
    parentId: Joi.string().allow(null)
  }),
  update: Joi.object({
    name: Joi.string().min(1).max(100),
    description: Joi.string().max(500),
    tags: Joi.array().items(Joi.string()),
    isPublic: Joi.boolean(),
    parentId: Joi.string().allow(null)
  })
};
