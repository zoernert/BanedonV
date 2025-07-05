import Joi from 'joi';

export const fileSchemas = {
  upload: Joi.object({
    collectionId: Joi.string().required(),
    name: Joi.string().min(1).max(255),
    description: Joi.string().max(1000),
    tags: Joi.array().items(Joi.string())
  }),
  update: Joi.object({
    name: Joi.string().min(1).max(255),
    description: Joi.string().max(1000),
    tags: Joi.array().items(Joi.string())
  })
};
